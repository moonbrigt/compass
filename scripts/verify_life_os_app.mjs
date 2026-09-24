#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(process.argv[2] || ".");
const pluginDir = path.join(root, ".obsidian/plugins/life-os-app");
const mainPath = path.join(pluginDir, "main.js");
const cssPath = path.join(pluginDir, "styles.css");
const manifestPath = path.join(pluginDir, "manifest.json");
const communityPath = path.join(root, ".obsidian/community-plugins.json");
const quickAddPath = path.join(root, ".obsidian/plugins/quickadd/data.json");
const noticesPath = path.join(root, "THIRD_PARTY_NOTICES.md");
const setupViewPath = path.join(root, "元数据/视图/setup.js");
const hotkeysPath = path.join(root, ".obsidian/hotkeys.json");

const results = [];
const check = (name, condition, detail = "") => {
  results.push({ name, ok: Boolean(condition), detail });
};
const read = (file) => fs.readFileSync(file, "utf8");
const readJson = (file) => JSON.parse(read(file));

for (const file of [mainPath, cssPath, manifestPath, communityPath, quickAddPath, noticesPath, setupViewPath, hotkeysPath]) {
  check(`present: ${path.relative(root, file)}`, fs.existsSync(file));
}

if (results.some((result) => !result.ok)) {
  finish();
}

const source = read(mainPath);
const css = read(cssPath);
const manifest = readJson(manifestPath);
const community = readJson(communityPath);
const quickAdd = readJson(quickAddPath);
const notices = read(noticesPath);
const setupView = read(setupViewPath);
const hotkeys = readJson(hotkeysPath);

check("manifest id", manifest.id === "life-os-app", String(manifest.id));
check("manifest is mobile-capable", manifest.isDesktopOnly === false);
check("plugin enabled", community.includes("life-os-app"));
check(
  "notice version matches manifest",
  notices.includes(`| life-os-app | ${manifest.version} |`),
  manifest.version
);
check(
  "Setup verifies the Life OS application",
  setupView.includes('["life-os-app", "Life OS"]') &&
    setupView.includes('commands?.["life-os-app:open-home"]')
);
check(
  "canonical Projects folder restored",
  fs.existsSync(path.join(root, "04 项目/Projects Board.md")) &&
    !fs.existsSync(path.join(root, "05 人物/04 项目/Projects Board.md"))
);
check(
  "primary Life OS hotkeys configured",
  Array.isArray(hotkeys["life-os-app:open-home"]) &&
    Array.isArray(hotkeys["life-os-app:open-capture"])
);

try {
  new vm.Script(source, { filename: mainPath });
  check("JavaScript parses", true);
} catch (error) {
  check("JavaScript parses", false, error.message);
}

const configuredCommands = new Set(
  (quickAdd.choices || []).map((choice) => `quickadd:choice:${choice.id}`)
);
const referencedCommands = new Set(
  [...source.matchAll(/quickadd:choice:[a-z0-9-]+/g)].map((match) => match[0])
);
const missingCommands = [...referencedCommands].filter(
  (command) => !configuredCommands.has(command)
);
const quickAddById = new Map(
  (quickAdd.choices || []).map((choice) => [choice.id, choice])
);
const recordChoiceContracts = [
  ["lifeos-new-project", "模板/Project.md", "04 项目"],
  ["lifeos-new-person", "模板/Person.md", "05 人物"],
  ["lifeos-new-newsletter", "模板/Newsletter.md", "06 写作/通讯"],
  ["lifeos-new-video", "模板/YouTube Script.md", "06 写作/YouTube 脚本"],
  ["lifeos-new-article", "模板/Article.md", "06 写作/文章"],
  ["lifeos-new-course-lesson", "模板/Course Lesson.md", "06 写作/课程内容"],
  ["lifeos-new-book", "模板/Book Note.md", "07 资料库/读书笔记"],
  ...(fs.existsSync(path.join(root, "09 阅读"))
    ? [["lifeos-new-study-note", "模板/Study Note.md", "09 阅读/研读笔记"]]
    : []),
];
const invalidRecordChoices = recordChoiceContracts.filter(
  ([id, templatePath, folder]) => {
    const choice = quickAddById.get(id);
    const prompt = choice?.fileNameFormat?.format?.match(/^\{\{VALUE:([^|}]+)\|label:([^|}]+)\|trim\}\}$/);
    return !(
      choice?.type === "Template" &&
      choice.command === true &&
      choice.templatePath === templatePath &&
      choice.folder?.folders?.includes(folder) &&
      prompt && prompt[1] === prompt[2] && /[\u4e00-\u9fff]/.test(prompt[1]) &&
      choice.fileExistsMode === "Nothing"
    );
  }
);
check(
  "record creation input contracts",
  invalidRecordChoices.length === 0,
  invalidRecordChoices.map(([id]) => id).join(", ")
);
check(
  "QuickAdd commands resolve",
  missingCommands.length === 0,
  missingCommands.join(", ")
);

const referencedPaths = new Set(
  [...source.matchAll(/(?:path:\s*|openPath\()"([^"]+\.md)"/g)].map(
    (match) => match[1]
  )
);
const missingPaths = [...referencedPaths].filter(
  (file) => !fs.existsSync(path.join(root, file))
);
check("dashboard paths resolve", missingPaths.length === 0, missingPaths.join(", "));

const classNames = new Set(
  [...source.matchAll(/life-os-[a-z0-9-]+/g)].map((match) => match[0])
);
const missingStyles = [...classNames].filter(
  (className) => !css.includes(`.${className}`)
);
check("application classes are styled", missingStyles.length === 0, missingStyles.join(", "));

const prohibitedCapabilities = [
  "fetch",
  "requestUrl",
  "XMLHttpRequest",
  "WebSocket",
  "child_process",
  "vault.create",
  "vault.modify",
  "vault.process",
  "vault.delete",
  "vault.trash",
  "adapter.write",
  "adapter.remove",
];
const capabilityHits = prohibitedCapabilities.filter((term) => source.includes(term));
check(
  "no network, process, or direct vault-write capability",
  capabilityHits.length === 0,
  capabilityHits.join(", ")
);

class FakeElement {
  constructor(tag = "div", options = {}) {
    this.tag = tag;
    this.options = options;
    this.children = [];
    this.handlers = {};
  }

  empty() {
    this.children = [];
  }

  addClass(name) { this.options.cls = `${this.options.cls || ""} ${name}`.trim(); }
  setAttribute(name, value) { this.options.attr = { ...this.options.attr, [name]: value }; }

  toHTML() {
    const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const attrs = { ...this.options.attr, ...(this.options.cls ? { class: this.options.cls } : {}) };
    return `<${this.tag} ${Object.entries(attrs).map(([key, value]) => `${key}="${escape(value)}"`).join(" ")}>${escape(this.options.text || "")}${this.children.map((child) => child.toHTML()).join("")}</${this.tag}>`;
  }

  createDiv(options = {}) {
    return this.createEl("div", options);
  }

  createSpan(options = {}) {
    return this.createEl("span", options);
  }

  createEl(tag, options = {}) {
    const child = new FakeElement(tag, options);
    this.children.push(child);
    return child;
  }

  addEventListener(name, handler) {
    this.handlers[name] = handler;
  }
}

class Component {
  // Child rendering is exercised in the real-browser fixture, not this DOM stub.
  addChild(child) { (this.children ||= new Set()).add(child); }
  removeChild(child) { this.children?.delete(child); }
  registerDomEvent(element, name, handler) {
    element.addEventListener(name, handler);
  }

  registerEvent(event) {
    return event;
  }
}

class ItemView extends Component {
  constructor(leaf) {
    super();
    this.leaf = leaf;
    this.app = leaf.app;
    this.contentEl = new FakeElement();
  }
}

class Modal {
  constructor(app) {
    this.app = app;
    this.contentEl = new FakeElement();
    Modal.lastOpened = this;
  }

  open() {
    this.onOpen();
  }

  close() {
    this.onClose();
  }
}

class Plugin extends Component {
  registerView(type, factory) {
    this.views = this.views || new Map();
    this.views.set(type, factory);
    this.viewType = type;
    this.viewFactory = factory;
  }

  addRibbonIcon(icon, name, callback) {
    this.ribbon = { icon, name, callback };
  }

  addCommand(command) {
    this.commands = this.commands || [];
    this.commands.push(command);
  }
}

class TFile {
  constructor(filePath = "") {
    this.path = filePath;
  }
}

class Notice {}

try {
  const moduleBox = { exports: {} };
  vm.runInNewContext(
    source,
    {
      module: moduleBox,
      exports: moduleBox.exports,
      require(id) {
        if (id !== "obsidian") {
          throw new Error(`Unexpected dependency: ${id}`);
        }
        return {
          ItemView,
          Component,
          Modal,
          Notice,
          Plugin,
          TFile,
          moment: () => {
            const date = new Date("2026-09-09T12:00:00Z");
            const api = {
              locale() {
                return this;
              },
              clone: () => {
                const cloned = new Date(date.getTime());
                return {
                  subtract(amount, unit) {
                    if (unit === "days") {
                      cloned.setUTCDate(cloned.getUTCDate() - amount);
                    }
                    return this;
                  },
                  format(format) {
                    if (format === "YYYY-MM-DD") {
                      return cloned.toISOString().slice(0, 10);
                    }
                    if (format === "ddd") {
                      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][cloned.getUTCDay()];
                    }
                    return "2026-09-09";
                  },
                };
              },
              format(format) {
                const values = {
                  "YYYY-MM-DD": "2026-09-09",
                  "gggg-[W]ww": "2026-W37",
                  "YYYY-[Q]Q": "2026-Q3",
                  "[Week] ww": "Week 37",
                  "D MMM": "9 Sep",
                };
                return values[format] || "2026-09-09";
              },
            };
            return api;
          },
          setIcon: () => {},
        };
      },
    },
    { filename: mainPath }
  );

  const fakeFiles = [
    new TFile("04 项目/Example.md"),
    new TFile("04 项目/Metadata Pending.md"),
    new TFile("05 人物/Person.md"),
    new TFile("06 写作/文章/Article.md"),
    new TFile("06 写作/文章/Sample.md"),
    new TFile("07 资料库/Task Example.md"),
    new TFile("08 任务/Tasks.md"),
    new TFile("08 任务/Archive.md"),
  ];
  const metadata = new Map([
    ["04 项目/Example.md", { type: "project", status: "active" }],
    ["05 人物/Person.md", { type: "person" }],
    ["06 写作/文章/Article.md", { type: "article" }],
    ["06 写作/文章/Sample.md", { type: "article", tags: ["example"] }],
    ["07 资料库/Task Example.md", { type: "book" }],
    [
      "元数据/Compass Config.md",
      {
        questions: [{ key: "dq_goals", text: "Did I set clear goals?" }],
        habits: ["habit_journal"],
      },
    ],
    ["01 日记/每日/2026-09-09.md", { dq_goals: 8, habit_journal: true }],
    ["00 仪表盘/Setup.md", { status: "open" }],
  ]);
  const taskItem = (task, line) => ({
    task,
    position: { start: { line } },
  });
  const listItems = new Map([
    [
      "04 项目/Example.md",
      [
        taskItem(" ", 0),
        taskItem("x", 4),
        taskItem("/", 5),
        taskItem("?", 6),
        taskItem("-", 7),
      ],
    ],
    ["05 人物/Person.md", [taskItem(" ", 0)]],
    ["06 写作/文章/Article.md", [taskItem(" ", 0)]],
    ["06 写作/文章/Sample.md", [taskItem(" ", 0)]],
    ["07 资料库/Task Example.md", [taskItem(" ", 0)]],
    ["08 任务/Tasks.md", [taskItem(" ", 0)]],
    ["08 任务/Archive.md", [taskItem(" ", 0)]],
  ]);
  const fileContents = new Map([
    [
      "04 项目/Example.md",
      [
        "- [ ] Ship the Life OS slice 📅 2026-09-09 ⏫",
        "```tasks",
        "- [ ] Fenced sample must stay out",
        "```",
        "- [x] Finished task ✅ 2026-09-08",
        "- [/] Continue the data pass ⏳ 2026-09-09",
        "- [?] Unknown custom status",
        "- [-] Cancelled task ❌ 2026-09-08",
      ].join("\n"),
    ],
    ["05 人物/Person.md", "- [ ] Discuss a decision #discuss"],
    ["06 写作/文章/Article.md", "- [ ] Draft the article 🔺"],
    ["06 写作/文章/Sample.md", "- [ ] Demonstration task"],
    ["07 资料库/Task Example.md", "- [ ] Out-of-scope library task"],
    ["08 任务/Tasks.md", "- [ ] Triage the inbox ➕ 2026-09-08"],
    ["08 任务/Archive.md", "- [ ] Out-of-scope task archive"],
  ]);
  const metadataUnavailable = new Set(["04 项目/Metadata Pending.md"]);
  const pluginInstances = new Map([
    ["agent-client", { settings: { defaultAgentId: "synthetic-agent", autoAllowPermissions: false } }],
    ["obsidian-local-rest-api", { settings: {} }],
  ]);
  const requestedPaths = [];
  const fakeLeaf = {
    app: null,
    async setViewState(state) {
      this.state = state;
    },
    async openFile(file) { this.openedFile = file; },
  };
  const commandCalls = [];
  const fakeApp = {
    commands: { executeCommandById: (id) => { commandCalls.push(id); return true; } },
    plugins: { getPlugin: (id) => pluginInstances.get(id) || null },
    metadataCache: {
      on: () => ({ off: () => {} }),
      getFileCache: (file) =>
        metadataUnavailable.has(file.path)
          ? null
          : {
              frontmatter: metadata.get(file.path) || {},
              listItems: listItems.get(file.path) || [],
            },
    },
    vault: {
      on: () => ({ off: () => {} }),
      getMarkdownFiles: () => fakeFiles,
      cachedRead: async (file) => {
        if (file.path.startsWith("05 人物/")) {
          throw new Error("simulated unreadable note");
        }
        return fileContents.get(file.path) || "";
      },
      getAbstractFileByPath: (filePath) => {
        requestedPaths.push(filePath);
        return filePath.endsWith(".md") ? new TFile(filePath) : null;
      },
    },
    workspace: {
      getLeavesOfType: () => [],
      getLeaf: () => fakeLeaf,
      onLayoutReady: (callback) => callback(),
      revealLeaf: async () => {},
      detachLeavesOfType: () => {},
    },
  };
  fakeLeaf.app = fakeApp;

  const LifeOSPlugin = moduleBox.exports;
  const plugin = new LifeOSPlugin();
  plugin.app = fakeApp;
  await plugin.onload();
  check("view registered", plugin.viewType === "life-os-home", plugin.viewType);
  check("Brain view registered", plugin.views.has("life-os-brain"));
  const commandIds = new Set((plugin.commands || []).map((command) => command.id));
  const requiredCommandIds = [
    "open-home",
    "open-capture",
    "open-configuration",
    "open-brain",
    ...[
      "today",
      "plan",
      "focus",
      "review",
      "projects",
      "people",
      "create",
      "library",
      "ai",
    ].map((screen) => `open-${screen}`),
  ];
  const missingAppCommands = requiredCommandIds.filter((id) => !commandIds.has(id));
  check(
    "application commands registered",
    missingAppCommands.length === 0,
    missingAppCommands.join(", ")
  );
  check("ribbon registered", plugin.ribbon?.icon === "compass", plugin.ribbon?.icon);

  const view = plugin.viewFactory(fakeLeaf);
  await view.onOpen();
  const screens = [
    "home",
    "today",
    "plan",
    "focus",
    "review",
    "projects",
    "people",
    "create",
    "library",
    "ai",
  ];
  const emptyScreens = [];
  const requiredPanels = {
    today: "life-os-today-live",
    plan: "life-os-plan-live",
    focus: "life-os-collection-live",
    review: "life-os-review-live",
    projects: "life-os-collection-live",
    people: "life-os-collection-live",
    create: "life-os-pipeline-live",
    library: "life-os-collection-live",
    ai: "life-os-ai-live",
  };
  const renderedPanels = new Set();
  const taskFeedsWithRows = new Set();
  let homeHasSystemSummary = false;
  let homeHasSetupBanner = false;
  let todayHasPropertyValues = false;
  let projectStatusLocalized = false;
  let libraryTypeLocalized = false;
  const treeHasClass = (element, className) =>
    String(element.options?.cls || "")
      .split(/\s+/)
      .includes(className) ||
    element.children.some((child) => treeHasClass(child, className));
  const treeHasText = (element, value) =>
    element.options?.text === value ||
    element.children.some((child) => treeHasText(child, value));
  for (const screen of screens) {
    view.activeScreen = screen;
    view.render();
    if (!view.contentEl.children.length) {
      emptyScreens.push(screen);
    }
    if (requiredPanels[screen] && treeHasClass(view.contentEl, requiredPanels[screen])) {
      renderedPanels.add(screen);
    }
    if (["today", "focus"].includes(screen) && treeHasClass(view.contentEl, "life-os-task-row")) {
      taskFeedsWithRows.add(screen);
    }
    if (screen === "home") {
      homeHasSystemSummary = treeHasClass(view.contentEl, "life-os-summary");
      homeHasSetupBanner = treeHasClass(view.contentEl, "life-os-setup-banner");
    }
    if (screen === "today") {
      todayHasPropertyValues =
        treeHasText(view.contentEl, "8/10") && treeHasText(view.contentEl, "已完成");
    }
    if (screen === "projects") projectStatusLocalized = treeHasText(view.contentEl, "进行中");
    if (screen === "library") libraryTypeLocalized = treeHasText(view.contentEl, "书籍");
  }
  check("project status displays in Chinese", projectStatusLocalized);
  check("library type displays in Chinese", libraryTypeLocalized);
  check("all application screens render", emptyScreens.length === 0, emptyScreens.join(", "));
  const missingPanels = Object.keys(requiredPanels).filter(
    (screen) => !renderedPanels.has(screen)
  );
  check("native live panels render", missingPanels.length === 0, missingPanels.join(", "));
  check(
    "task feed renders indexed commitments",
    taskFeedsWithRows.size === 2,
    [...taskFeedsWithRows].join(", ")
  );
  check("Home avoids duplicate system summary", !homeHasSystemSummary);
  check("Home onboarding state renders", homeHasSetupBanner);
  check("Today renders configured property values", todayHasPropertyValues);
  metadata.set("00 仪表盘/Setup.md", { status: "done" });
  view.activeScreen = "home";
  view.render();
  check(
    "completed onboarding banner hides",
    !treeHasClass(view.contentEl, "life-os-setup-banner")
  );
  metadata.set("00 仪表盘/Setup.md", { status: "open" });
  check(
    "task index degrades per file",
    view.taskSnapshot?.tasks.length === 4 &&
      view.taskSnapshot?.state === "partial" &&
      view.taskSnapshot?.skipped === 2,
    JSON.stringify({
      tasks: view.taskSnapshot?.tasks.length,
      state: view.taskSnapshot?.state,
      skipped: view.taskSnapshot?.skipped,
    })
  );
  const indexedTaskTexts = new Set(
    (view.taskSnapshot?.tasks || []).map((task) => task.text)
  );
  check(
    "task index uses structural metadata and includes Writing",
    indexedTaskTexts.has("Ship the Life OS slice") &&
      indexedTaskTexts.has("Continue the data pass") &&
      indexedTaskTexts.has("Draft the article") &&
      indexedTaskTexts.has("Triage the inbox")
  );
  check(
    "task index excludes fences, closed tasks, and non-source files",
    !indexedTaskTexts.has("Fenced sample must stay out") &&
      !indexedTaskTexts.has("Finished task") &&
      !indexedTaskTexts.has("Cancelled task") &&
      !indexedTaskTexts.has("Out-of-scope library task") &&
      !indexedTaskTexts.has("Out-of-scope task archive")
  );
  check(
    "task index reports unknown statuses without guessing",
    view.taskSnapshot?.unresolvedStatuses === 1 &&
      !indexedTaskTexts.has("Unknown custom status"),
    String(view.taskSnapshot?.unresolvedStatuses)
  );
  check(
    "task index reports metadata coverage and sample exclusions",
    view.taskSnapshot?.missingMetadata === 1 &&
      view.taskSnapshot?.examplesExcluded === 1 &&
      view.taskSnapshot?.candidateFiles === 6,
    JSON.stringify({
      missingMetadata: view.taskSnapshot?.missingMetadata,
      examplesExcluded: view.taskSnapshot?.examplesExcluded,
      candidateFiles: view.taskSnapshot?.candidateFiles,
    })
  );
  view.activeScreen = "home";
  view.render();
  check(
    "task feed exposes partial index coverage",
    treeHasText(
      view.contentEl,
      "4 项未完成, 1 个文件无法读取, 1 个文件的元数据待加载, 1 项状态无法识别, 1 个示例已排除"
    )
  );
  check(
    "task display strips supported Tasks metadata",
    [...indexedTaskTexts].every(
      (text) => !/[📅⏳➕🔺⏫🔼🔽⏬]/u.test(text)
    )
  );

  view.activeScreen = "ai";
  view.render();
  check(
    "permission status reports observable policy without enforcement claim",
    treeHasText(view.contentEl, "手动提示词") &&
      treeHasText(view.contentEl, "客户端设置已关闭自动批准。这里只显示配置，不代表每项操作都会被强制拦截。") &&
      !treeHasText(view.contentEl, "每次写入都必须批准")
  );
  pluginInstances.get("agent-client").settings.autoAllowPermissions = true;
  view.render();
  check(
    "permission status warns when auto-allow is enabled",
    treeHasText(view.contentEl, "自动批准已开启") &&
      treeHasText(view.contentEl, "客户端可能自动批准请求。这里只显示配置，不代表每项操作都会被强制拦截。")
  );
  delete pluginInstances.get("agent-client").settings.autoAllowPermissions;
  view.render();
  check(
    "permission status remains unknown when setting is unobservable",
    treeHasText(view.contentEl, "未知") &&
      treeHasText(view.contentEl, "无法读取权限设置，因此无法确认审批是否受到强制执行。")
  );
  pluginInstances.get("agent-client").settings.autoAllowPermissions = false;

  metadata.set("元数据/Compass Config.md", {
    questions: [{ key: "dq_goals", text: "Did I set clear goals?" }],
    habits: ["habit_journal", "habit_exercise", "habit_reading"],
  });
  metadata.set("01 日记/每日/2026-09-09.md", {
    dq_goals: true,
    habit_journal: false,
    habit_reading: "yes",
  });
  const strictToday = view.getTodayData();
  check(
    "Today rejects boolean effort scores",
    strictToday.questionRecorded === 0 &&
      strictToday.questions[0]?.state === "invalid" &&
      strictToday.questions[0]?.display === "无效数值"
  );
  check(
    "Today distinguishes unchecked, missing, and invalid habits",
    strictToday.habitRecorded === 1 &&
      strictToday.habitDone === 0 &&
      strictToday.habits.map((habit) => habit.state).join(",") ===
        "unchecked,missing,invalid" &&
      strictToday.habits.map((habit) => habit.display).join(",") ===
        "未勾选,未记录,无效数值"
  );
  const coverage = view.summarizeDailyProperties(
    {
      dq_one: 8,
      dq_two: "8",
      habit_one: false,
      habit_two: true,
      habit_three: "false",
    },
    ["dq_one", "dq_two"],
    ["habit_one", "habit_two", "habit_three"]
  );
  check(
    "daily property coverage counts recorded false separately from habits done",
    coverage.questionsRecorded === 1 &&
      coverage.habitsRecorded === 2 &&
      coverage.habitsDone === 1 &&
      coverage.recorded === 3,
    JSON.stringify(coverage)
  );
  metadata.set("元数据/Compass Config.md", {
    daily_folder: "/Custom/Daily/",
    weekly_folder: "Custom/Weekly/",
    quarterly_folder: "Custom/Quarterly",
    retreat_folder: "Custom/Retreats",
    projects_folder: "Custom/Projects/",
    questions: [{ key: "dq_goals", text: "Did I set clear goals?" }],
    habits: ["habit_journal"],
  });
  requestedPaths.length = 0;
  view.getTodayData();
  view.renderPlanLive(new FakeElement());
  view.renderReviewLive(new FakeElement());
  view.getSystemStats();
  await view.openPath("04 项目/Projects Board.md");
  const configuredFolders = view.getConfiguredFolders();
  check(
    "configured folders normalize without leading or trailing slashes",
    JSON.stringify(configuredFolders) === JSON.stringify({
      daily: "Custom/Daily",
      weekly: "Custom/Weekly",
      quarterly: "Custom/Quarterly",
      retreats: "Custom/Retreats",
      projects: "Custom/Projects",
    }),
    JSON.stringify(configuredFolders)
  );
  check(
    "Today, Plan, Review, and system stats use configured period paths",
    [
      "Custom/Daily/2026-09-09.md",
      "Custom/Weekly/2026-W37.md",
      "Custom/Quarterly/2026-Q3.md",
      "Custom/Retreats/2026-Q3 Personal Retreat.md",
      "Custom/Projects/Projects Board.md",
    ].every((path) => requestedPaths.includes(path)),
    requestedPaths.filter((path) => path.startsWith("Custom/")).join(", ")
  );
  check(
    "domain records use the configured projects folder",
    view.isDomainRecord(new TFile("Custom/Projects/Project.md")) &&
      !view.isDomainRecord(new TFile("04 项目/Project.md"))
  );
  metadata.set("元数据/Compass Config.md", {
    questions: [{ key: "dq_goals", text: "Did I set clear goals?" }],
    habits: ["habit_journal"],
  });
  metadata.set("01 日记/每日/2026-09-09.md", {
    dq_goals: 8,
    habit_journal: true,
  });

  const editorCalls = [];
  const taskLeaf = {
    view: {
      editor: {
        setCursor: (position) => editorCalls.push(["cursor", position]),
        scrollIntoView: (range) => editorCalls.push(["scroll", range]),
      },
    },
    async openFile(file) { this.openedFile = file; },
  };
  const getLeaf = fakeApp.workspace.getLeaf;
  fakeApp.workspace.getLeaf = () => taskLeaf;
  await view.openPath("08 任务/Tasks.md", 7);
  fakeApp.workspace.getLeaf = getLeaf;
  check(
    "task navigation targets the indexed source line",
    taskLeaf.openedFile?.path === "08 任务/Tasks.md" &&
      editorCalls[0]?.[0] === "cursor" &&
      editorCalls[0]?.[1]?.line === 6
  );

  plugin.openCapture();
  check(
    "capture modal renders three action groups",
    (Modal.lastOpened?.contentEl.children || []).filter((child) =>
      treeHasClass(child, "life-os-capture-section")
    ).length === 3
  );
  const findCaptureChoice = (element) =>
    String(element.options?.cls || "").split(/\s+/).includes("life-os-capture-choice")
      ? element
      : element.children.map(findCaptureChoice).find(Boolean);
  const firstCaptureChoice = findCaptureChoice(Modal.lastOpened.contentEl);
  firstCaptureChoice?.handlers.click?.();
  check(
    "capture choice executes the QuickAdd command",
    commandCalls.at(-1) === "quickadd:choice:lifeos-journal" &&
      Modal.lastOpened.contentEl.children.length === 0
  );
  fakeLeaf.view = view;
  fakeApp.workspace.getLeavesOfType = () => [fakeLeaf];
  await plugin.activateView("today");
  check("view activation state", fakeLeaf.state?.type === "life-os-home", fakeLeaf.state?.type);
  check("direct module activation", view.activeScreen === "today", view.activeScreen);

  fakeFiles.push(new TFile("01 日记/每日/2026-09-09.md"), new TFile("01 日记/每日/2026-09-08.md"));
  metadata.set("01 日记/每日/2026-09-08.md", { tags: ["example"], dq_goals: 2, habit_journal: false });
  const real = view.getAnalytics();
  check("analytics excludes sample scores and preserves missing days", real.average === 8 && real.scored === 1 && real.days.filter((day) => day.score === null).length === 29);
  view.includeExamples = true;
  check("analytics sample inclusion is explicit", view.getAnalytics().average === 5);
  metadata.set("01 日记/每日/2026-09-08.md", { dq_goals: true, habit_journal: false });
  check("boolean question values are not numeric scores", view.getAnalytics().scored === 1);
  view.includeExamples = false;
  check("record counters exclude templates and build copies",
    !view.isDomainRecord(new TFile("模板/Project.md")) &&
    !view.isDomainRecord(new TFile("build/04 项目/Project.md")));
  view.activeScreen = "home";
  view.render();
  const findText = (element, text) => element.options?.text === text ? element :
    element.children.map((child) => findText(child, text)).find(Boolean);
  check("Home keeps full analytics in Review", !findText(view.contentEl, "7 天") && !!findText(view.contentEl, "查看复盘"));
  view.activeScreen = "review";
  view.render();
  findText(view.contentEl, "7 天").handlers.click();
  check("chart range control changes aggregation window", view.getAnalytics().days.length === 7);
  findText(view.contentEl, "包含示例").handlers.click();
  check("sample control changes state", view.includeExamples === true);
  view.analyticsDays = 30;
  view.includeExamples = false;

  if (process.env.LIFE_OS_PREVIEW) {
    // Generated visual-test artifact uses synthetic fixtures only.
    for (let i = 0; i < 30; i += 1) {
      const date = new Date("2026-09-09T12:00:00Z"); date.setUTCDate(date.getUTCDate() - i);
      const filePath = `01 日记/每日/${date.toISOString().slice(0, 10)}.md`;
      if (!fakeFiles.some((file) => file.path === filePath)) fakeFiles.push(new TFile(filePath));
      metadata.set(filePath, { dq_goals: 4 + i % 7, habit_journal: i % 3 !== 0, habit_reading: i % 4 !== 0, habit_exercise: i % 2 === 0 });
    }
    fakeFiles.push(new TFile("02 静修/2026-Q3 Personal Retreat.md"));
    metadata.set("02 静修/2026-Q3 Personal Retreat.md", { wheel_health: 7, wheel_relationships: 8, wheel_growth: 6, wheel_career: 7, wheel_fun: 5, wheel_meaning: 8 });
    view.activeScreen = "home"; view.render();
    fs.writeFileSync(process.env.LIFE_OS_PREVIEW, `<!doctype html><html><head><meta charset="utf-8"><title>Life OS visual test, synthetic data</title><style>
      :root { --background-primary:#202020; --background-secondary:#292929; --text-normal:#ddd; --text-muted:#aaa; --text-faint:#888; --color-green:#7aa995; --color-red:#df7777; }
      body { margin:0; background:#202020; color:#ddd; font-family:Arial,sans-serif; } button { height:30px; border-radius:18px; white-space:nowrap; padding:4px 10px; } .fixture-pane { width:100%; }
      ${css}</style></head><body><div class="fixture-pane">${view.contentEl.toHTML()}</div></body></html>`);
  }
} catch (error) {
  check("runtime smoke", false, error.stack || error.message);
}

finish();

function finish() {
  const failed = results.filter((result) => !result.ok);
  for (const result of failed) {
    console.error(`FAIL ${result.name}${result.detail ? ` (${result.detail})` : ""}`);
  }
  console.log(`${results.length - failed.length} passed, ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
}
