const {
  Component,
  ItemView,
  Modal,
  Notice,
  Plugin,
  TFile,
  moment,
  setIcon,
} = require("obsidian");

const VIEW_TYPE = "life-os-home";

const DEFAULT_FOLDERS = Object.freeze({
  daily: "01 Journal/Daily",
  weekly: "01 Journal/Weekly",
  quarterly: "01 Journal/Quarterly",
  retreats: "02 Retreats",
  projects: "04 Projects",
});

const TASK_STATUS_TYPES = Object.freeze({
  " ": "open",
  "/": "open",
  x: "closed",
  X: "closed",
  "-": "closed",
});

const PROPERTY_LABELS = Object.freeze({
  dq_goals: "目标",
  dq_progress: "进展",
  dq_meaning: "意义",
  dq_happy: "快乐",
  dq_relationships: "积极关系",
  dq_engaged: "全心投入",
  habit_journal: "日记",
  habit_exercise: "运动",
  habit_reading: "阅读",
  wheel_health: "健康",
  wheel_relationships: "人际关系",
  wheel_family: "家庭",
  wheel_career: "事业",
  wheel_finances: "财务",
  wheel_growth: "成长",
  wheel_fun: "乐趣",
  wheel_meaning: "意义",
});

const RECORD_TYPE_LABELS = Object.freeze({
  article: "文章",
  "bible-chapter": "经文章节",
  "bible-verse": "经文节",
  book: "书籍",
  "course-lesson": "课程课时",
  newsletter: "通讯",
  person: "人物",
  project: "项目",
  sermon: "研读笔记",
  source: "资料来源",
  topical: "主题",
  "youtube-script": "视频脚本",
});

const RECORD_STATUS_LABELS = Object.freeze({
  active: "进行中",
  archived: "已归档",
  complete: "已完成",
  completed: "已完成",
  done: "已完成",
  drafting: "起草中",
  finished: "已读完",
  open: "进行中",
  paused: "已暂停",
  planned: "已计划",
  reading: "阅读中",
});

function recordLabel(value, labels, fallback) {
  const raw = String(value || "").trim();
  return raw ? labels[raw.toLowerCase()] || raw : fallback;
}

function normalizeFolder(value, fallback) {
  const normalized = String(value || fallback)
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return normalized || fallback;
}

function ratingState(value) {
  if (value === undefined || value === null || value === "") {
    return { state: "missing", value: null };
  }
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 10
  ) {
    return { state: "recorded", value };
  }
  return { state: "invalid", value: null };
}

function habitState(value) {
  if (value === undefined || value === null || value === "") {
    return "missing";
  }
  if (value === true) {
    return "done";
  }
  if (value === false) {
    return "unchecked";
  }
  return "invalid";
}

const CAPTURE_ACTIONS = [
  {
    icon: "notebook-pen",
    label: "日记",
    description: "在今天的日记中追加一条记录。",
    command: "quickadd:choice:lifeos-journal",
  },
  {
    icon: "trophy",
    label: "记录一件好事",
    description: "记下值得记住的事。",
    command: "quickadd:choice:lifeos-win",
  },
  {
    icon: "heart",
    label: "感恩",
    description: "记录你心怀感激的事。",
    command: "quickadd:choice:lifeos-gratitude",
  },
  {
    icon: "check-square",
    label: "添加任务",
    description: "将任务加入任务总表的收件箱。",
    command: "quickadd:choice:lifeos-task",
  },
];

const CAPTURE_MENU_ACTIONS = [
  ...CAPTURE_ACTIONS,
  {
    icon: "lightbulb",
    label: "项目想法",
    description: "在项目看板中添加一个想法。",
    command: "quickadd:choice:lifeos-project-idea",
  },
  {
    icon: "mail",
    label: "通讯选题",
    description: "在通讯待办池中添加选题。",
    command: "quickadd:choice:lifeos-newsletter-idea",
  },
  {
    icon: "video",
    label: "视频选题",
    description: "在视频待办池中添加选题。",
    command: "quickadd:choice:lifeos-video-idea",
  },
  {
    icon: "newspaper",
    label: "文章选题",
    description: "在文章待办池中添加选题。",
    command: "quickadd:choice:lifeos-article-idea",
  },
  {
    icon: "folder-plus",
    label: "新建项目",
    description: "使用标准模板创建项目笔记。",
    command: "quickadd:choice:lifeos-new-project",
  },
  {
    icon: "user-plus",
    label: "新建人物笔记",
    description: "使用模板创建私密的人物关系笔记。",
    command: "quickadd:choice:lifeos-new-person",
  },
  {
    icon: "file-plus-2",
    label: "新建通讯",
    description: "使用模板创建通讯草稿。",
    command: "quickadd:choice:lifeos-new-newsletter",
  },
  {
    icon: "file-video-2",
    label: "新建视频脚本",
    description: "使用模板创建视频脚本。",
    command: "quickadd:choice:lifeos-new-video",
  },
  {
    icon: "file-pen-line",
    label: "新建文章",
    description: "使用模板创建文章草稿。",
    command: "quickadd:choice:lifeos-new-article",
  },
  {
    icon: "graduation-cap",
    label: "新建课程课时",
    description: "使用模板创建课程课时。",
    command: "quickadd:choice:lifeos-new-course-lesson",
  },
  {
    icon: "book-plus",
    label: "新建读书笔记",
    description: "在本地资料库中创建读书笔记。",
    command: "quickadd:choice:lifeos-new-book",
  },
  {
    icon: "book-open-check",
    label: "新建研读笔记",
    description: "使用模板创建研读笔记。",
    command: "quickadd:choice:lifeos-new-study-note",
  },
];

const PERIOD_ACTIONS = [
  {
    icon: "calendar-days",
    label: "今日",
    description: "打开或创建今天的日记。",
    command: "quickadd:choice:lifeos-daily",
  },
  {
    icon: "calendar-range",
    label: "本周",
    description: "打开或创建本周复盘。",
    command: "quickadd:choice:lifeos-weekly",
  },
  {
    icon: "compass",
    label: "本季度",
    description: "打开本季度笔记。",
    command: "quickadd:choice:lifeos-quarterly",
  },
  {
    icon: "tent-tree",
    label: "个人静修",
    description: "打开本季度的个人静修笔记。",
    command: "quickadd:choice:lifeos-retreat",
  },
];

const DESTINATIONS = [
  {
    icon: "layout-dashboard",
    label: "Compass",
    description: "汇总方向、习惯、每日问题和生活之轮。",
    path: "00 Dashboards/Compass Dashboard.md",
  },
  {
    icon: "list-checks",
    label: "任务",
    description: "查看完整的任务系统。",
    path: "00 Dashboards/Task Dashboard.md",
  },
  {
    icon: "folder-kanban",
    label: "项目",
    description: "查看进行中的项目和想法。",
    path: "00 Dashboards/Projects Dashboard.md",
  },
  {
    icon: "columns-3",
    label: "看板",
    description: "打开写作和项目看板。",
    path: "00 Dashboards/Boards.md",
  },
];

const NAV_ITEMS = [
  { id: "home", icon: "home", label: "首页" },
  { id: "today", icon: "sun", label: "今日" },
  { id: "plan", icon: "calendar-range", label: "计划" },
  { id: "focus", icon: "crosshair", label: "专注" },
  { id: "review", icon: "line-chart", label: "复盘" },
  { id: "projects", icon: "folder-kanban", label: "项目" },
  { id: "people", icon: "users", label: "人物" },
  { id: "create", icon: "pen-tool", label: "新建" },
  { id: "library", icon: "library", label: "资料库" },
  { id: "brain", icon: "brain", label: "知识图谱" },
  { id: "ai", icon: "sparkles", label: "AI" },
];

const MODULES = {
  today: {
    eyebrow: "每日工作台",
    title: "今日",
    description:
      "明确重要的事，记录发生的事，诚实地结束这一天。",
    actions: [
      PERIOD_ACTIONS[0],
      ...CAPTURE_ACTIONS,
      {
        icon: "list-checks",
        label: "今日任务",
        description: "打开任务建议仪表盘。",
        path: "00 Dashboards/Task Dashboard.md",
      },
      {
        icon: "activity",
        label: "习惯",
        description: "查看近期习惯坚持情况。",
        path: "00 Dashboards/Habit Canvas.md",
      },
    ],
  },
  plan: {
    eyebrow: "衔接不同时间跨度",
    title: "计划",
    description:
      "让今天、本周和本季度的计划朝向同一个方向。",
    actions: [
      ...PERIOD_ACTIONS,
      {
        icon: "folder-kanban",
        label: "项目",
        description: "检查进行中的项目是否符合季度方向。",
        path: "00 Dashboards/Projects Dashboard.md",
      },
      {
        icon: "clock-3",
        label: "理想一周",
        description: "检查计划是否安排进了时间表。",
        path: "03 Planning/Ideal Week.md",
      },
    ],
  },
  focus: {
    eyebrow: "聚焦重要的事",
    title: "专注",
    description:
      "看清哪些承诺在争夺注意力，回到重要的工作。",
    actions: [
      {
        icon: "compass",
        label: "Compass",
        description: "返回整体生活概览。",
        path: "00 Dashboards/Compass Dashboard.md",
      },
      {
        icon: "list-checks",
        label: "任务建议",
        description: "查看到期、已安排、高优先级和待讨论任务。",
        path: "00 Dashboards/Task Dashboard.md",
      },
      {
        icon: "folder-kanban",
        label: "项目进展",
        description: "找出需要下一步行动的进行中项目。",
        path: "00 Dashboards/Projects Dashboard.md",
      },
      {
        icon: "activity",
        label: "习惯记录",
        description: "结合具体日期查看习惯的持续情况。",
        path: "00 Dashboards/Habit Canvas.md",
      },
    ],
  },
  review: {
    eyebrow: "以记录为依据",
    title: "复盘",
    description:
      "回看每日与季度记录，再决定接下来调整什么。",
    actions: [
      {
        icon: "line-chart",
        label: "每日问题",
        description: "查看努力程度评分和趋势。",
        path: "00 Dashboards/Daily Questions.md",
      },
      {
        icon: "activity",
        label: "习惯画布",
        description: "查看连续记录、空缺和完成情况。",
        path: "00 Dashboards/Habit Canvas.md",
      },
      PERIOD_ACTIONS[1],
      PERIOD_ACTIONS[2],
      PERIOD_ACTIONS[3],
      {
        icon: "compass",
        label: "整体生活复盘",
        description: "打开 Compass 仪表盘和生活之轮。",
        path: "00 Dashboards/Compass Dashboard.md",
      },
    ],
  },
  projects: {
    eyebrow: "有背景的目标",
    title: "项目",
    description:
      "将目标、下一步行动、相关人物、笔记和季度承诺放在一起。",
    actions: [
      {
        icon: "layout-dashboard",
        label: "项目仪表盘",
        description: "查看所有进行中的项目。",
        path: "00 Dashboards/Projects Dashboard.md",
      },
      {
        icon: "columns-3",
        label: "项目看板",
        description: "在看板中推进想法和项目。",
        path: "04 Projects/Projects Board.md",
      },
      {
        icon: "lightbulb",
        label: "记录想法",
        description: "在看板中添加项目想法。",
        command: "quickadd:choice:lifeos-project-idea",
      },
      {
        icon: "folder-plus",
        label: "新建项目",
        description: "使用标准模板创建项目笔记。",
        command: "quickadd:choice:lifeos-new-project",
      },
      {
        icon: "calendar-range",
        label: "季度计划",
        description: "检查哪些项目服务于本季度目标。",
        command: "quickadd:choice:lifeos-quarterly",
      },
    ],
  },
  people: {
    eyebrow: "持续记录关系",
    title: "人物",
    description:
      "将后续事项、会面背景和待讨论内容关联到人物笔记。",
    actions: [
      {
        icon: "user-plus",
        label: "新建人物笔记",
        description: "使用模板创建私密的人物笔记。",
        command: "quickadd:choice:lifeos-new-person",
      },
      {
        icon: "messages-square",
        label: "待讨论事项",
        description: "按人物和讨论背景查看任务。",
        path: "00 Dashboards/Task Dashboard.md",
      },
      {
        icon: "search",
        label: "搜索人物",
        description: "在仓库中搜索人物或会面背景。",
        command: "global-search:open",
      },
    ],
  },
  create: {
    eyebrow: "让想法成为作品",
    title: "新建",
    description:
      "将想法推进为通讯、视频、文章和课程，同时保留资料来源。",
    actions: [
      {
        icon: "columns-3",
        label: "创作看板",
        description: "打开所有写作流程看板。",
        path: "00 Dashboards/Boards.md",
      },
      ...CAPTURE_MENU_ACTIONS.filter((action) =>
        [
          "quickadd:choice:lifeos-newsletter-idea",
          "quickadd:choice:lifeos-video-idea",
          "quickadd:choice:lifeos-article-idea",
          "quickadd:choice:lifeos-new-newsletter",
          "quickadd:choice:lifeos-new-video",
          "quickadd:choice:lifeos-new-article",
          "quickadd:choice:lifeos-new-course-lesson",
        ].includes(action.command)
      ),
    ],
  },
  library: {
    eyebrow: "有背景的知识",
    title: "资料库",
    description:
      "让书籍、资料、阅读记录和想法与相关工作保持关联。",
    actions: [
      {
        icon: "book-plus",
        label: "新建读书笔记",
        description: "创建标准读书笔记。",
        command: "quickadd:choice:lifeos-new-book",
      },
      {
        icon: "book-open-check",
        label: "新建研读笔记",
        description: "创建阅读研读笔记。",
        command: "quickadd:choice:lifeos-new-study-note",
      },
      {
        icon: "book-open",
        label: "阅读计划",
        description: "打开当前阅读计划。",
        path: "09 Reading/Reading Plan.md",
      },
      {
        icon: "search",
        label: "搜索资料库",
        description: "搜索书籍、资料和相关笔记。",
        command: "global-search:open",
      },
      {
        icon: "pen-tool",
        label: "写作流程",
        description: "在创作中使用资料库。",
        path: "00 Dashboards/Boards.md",
      },
    ],
  },
  ai: {
    eyebrow: "受控的 AI 助手",
    title: "AI",
    description:
      "以仓库内容为背景提问、复盘和起草，并让每次修改保持可见。",
    actions: [
      {
        icon: "sparkles",
        label: "打开助手",
        description: "使用完整的提示词库。",
        path: "00 Dashboards/Assistant.md",
      },
      {
        icon: "sun",
        label: "今日要事",
        description: "打开 Compass 简报和每日背景。",
        path: "00 Dashboards/Compass Dashboard.md",
      },
      {
        icon: "list-checks",
        label: "任务整理",
        description: "打开任务仪表盘及其 AI 工作流。",
        path: "00 Dashboards/Task Dashboard.md",
      },
      {
        icon: "shield-check",
        label: "设置与权限",
        description: "检查 AI、MCP 和备份的准备情况。",
        path: "00 Dashboards/Setup.md",
      },
    ],
  },
};

class LifeOSCaptureModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("life-os-capture-modal");
    root.createEl("h2", { text: "快速记录" });
    root.createEl("p", {
      text: "选择记录类型，Life OS 会将内容送到对应位置。",
    });

    const groups = [
      { title: "快速记录", actions: CAPTURE_MENU_ACTIONS.slice(0, 4) },
      { title: "想法", actions: CAPTURE_MENU_ACTIONS.slice(4, 8) },
      { title: "新建笔记", actions: CAPTURE_MENU_ACTIONS.slice(8) },
    ];
    for (const group of groups) {
      const section = root.createDiv({ cls: "life-os-capture-section" });
      section.createEl("h3", { text: group.title });
      const grid = section.createDiv({ cls: "life-os-capture-grid" });
      for (const action of group.actions) {
        const button = grid.createEl("button", {
          cls: "life-os-capture-choice",
        });
        button.type = "button";
        const icon = button.createSpan();
        setIcon(icon, action.icon);
        const copy = button.createSpan();
        copy.createEl("strong", { text: action.label });
        copy.createEl("small", { text: action.description });
        button.addEventListener("click", () => {
          this.close();
          this.plugin.runCommand(action.command, action.label);
        });
      }
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

class LifeOSHomeView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.activeScreen = "home";
    this.taskSnapshot = null;
    this.refreshSequence = 0;
    this.refreshTimer = null;
    this.analyticsDays = 30;
    this.includeExamples = false;
    this.showVisuals = true;
    this.visualOptions = {};
    this.itemLimit = 6;
    this.focusGroup = "all";
    this.libraryStatus = "all";
    this.compactLayout = false;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "Life OS";
  }

  getIcon() {
    return "compass";
  }

  async onOpen() {
    const refresh = () => this.queueRefresh();
    this.registerEvent(this.app.metadataCache.on("changed", refresh));
    this.registerEvent(this.app.vault.on("create", refresh));
    this.registerEvent(this.app.vault.on("modify", refresh));
    this.registerEvent(this.app.vault.on("delete", refresh));
    this.registerEvent(this.app.vault.on("rename", refresh));
    await this.refreshLiveData();
  }

  async onClose() {
    this.refreshSequence += 1;
    this.closeBrain();
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.contentEl.empty();
  }

  queueRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = null;
      void this.refreshLiveData();
    }, 120);
  }

  async refreshLiveData() {
    const sequence = ++this.refreshSequence;
    this.render();
    const taskSnapshot = await this.loadTaskSnapshot();
    if (sequence !== this.refreshSequence) {
      return;
    }
    this.taskSnapshot = taskSnapshot;
    this.render();
  }

  render(force = false) {
    if (!force && this.activeScreen === "brain" && this.embeddedBrain) return;
    this.closeBrain();
    const root = this.contentEl;
    root.empty();
    root.addClass("life-os-home");

    const frame = root.createDiv({ cls: this.compactLayout ? "life-os-app-frame is-compact" : "life-os-app-frame" });
    this.renderRail(frame);

    const main = frame.createEl("main", { cls: "life-os-main" });
    this.renderTopbar(main);

    if (this.activeScreen === "brain") {
      const host = main.createDiv({ cls: "life-os-brain-embedded" });
      this.embeddedBrain = new LifeOSBrainRenderer(this.app, host);
      this.addChild(this.embeddedBrain);
      return;
    }
    const shell = main.createDiv({ cls: "life-os-shell" });
    if (this.activeScreen === "home") {
      this.renderHome(shell);
    } else {
      this.renderModule(shell);
    }
  }

  closeBrain() {
    if (this.embeddedBrain) this.removeChild(this.embeddedBrain);
    if (this.previewBrain) {
      this.previewGeometry = this.previewBrain.brainGeometry;
      this.removeChild(this.previewBrain);
    }
    this.previewBrain = null;
    this.embeddedBrain = null;
  }

  renderHome(shell) {
    const hero = shell.createEl("header", { cls: "life-os-hero" });
    const identity = hero.createDiv({ cls: "life-os-identity" });
    const mark = identity.createSpan({ cls: "life-os-mark" });
    setIcon(mark, "compass");

    const words = identity.createDiv();
    words.createEl("h1", { text: "LIFE" });
    words.createEl("p", {
      text: "看清现状，主动选择，充实生活。",
    });

    hero.createDiv({
      cls: "life-os-date",
      text: moment().locale("zh-cn").format("YYYY年M月D日 dddd"),
    });

    const status = hero.createDiv({ cls: "life-os-status-row" });
    this.addStatus(status, "shield-check", "本地优先", true);

    const aiReady =
      this.pluginLoaded("agent-client") &&
      this.pluginLoaded("obsidian-local-rest-api");

    this.addStatus(
      status,
      "sparkles",
      aiReady ? "AI 工具已加载" : "AI 暂不可用",
      aiReady
    );

    const heroActions = hero.createDiv({ cls: "life-os-hero-actions" });
    this.addButton(heroActions, {
      icon: "calendar-days",
      label: "打开今日笔记",
      description: "从今天开始。",
      primary: true,
      onClick: () =>
        this.runCommand("quickadd:choice:lifeos-daily", "今日笔记"),
    });

    this.addButton(heroActions, {
      icon: "sparkles",
      label: "询问 Life OS",
      description: "打开受控的 AI 工作区。",
      onClick: () => this.openPath("00 Dashboards/Assistant.md"),
    });

    this.renderSetupBanner(shell);
    const overview = shell.createDiv({ cls: "life-os-home-overview" });
    const now = overview.createEl("section", { cls: "life-os-home-now" });
    now.createEl("h2", { text: "现在" });
    this.renderTaskLive(now, { limit: 3, attention: true });
    if (this.visualEnabled()) {
      const card = overview.createEl("section", { cls: "life-os-brain-card" });
      card.createEl("h2", { text: "相互关联的笔记" });
      const host = card.createDiv({ cls: "life-os-brain-preview" });
      this.previewBrain = new LifeOSBrainRenderer(this.app, host, true);
      this.previewBrain.brainGeometry = this.previewGeometry;
      this.addChild(this.previewBrain);
      this.addButton(card, { icon: "brain", label: "探索知识图谱", description: "在此页面打开完整关系图。", onClick: () => { this.activeScreen = "brain"; this.render(); } });
    }

    this.renderActionSection(
      shell,
      "快速记录",
      "不打断当前思路，快速记下内容。",
      CAPTURE_ACTIONS,
      (action) => this.runCommand(action.command, action.label)
    );
    this.renderPlanLive(shell);
    const signals = shell.createEl("section", { cls: "life-os-signals" });
    const model = this.getAnalytics();
    signals.createEl("h2", { text: "已有记录" });
    signals.createEl("p", { text: `近 ${this.analyticsDays} 天有 ${model.scored} 天记录了评分 · ${model.average === null ? "暂无努力程度评分" : `平均努力程度 ${model.average.toFixed(1)}/10`}。未记录的日期不计为零分。${this.includeExamples ? " 已包含示例。" : " 已排除示例。"}` });
    this.addButton(signals, { icon: "chart-line", label: "查看复盘", description: "查看努力程度、习惯节奏和生活领域。", onClick: () => { this.activeScreen = "review"; this.render(); } });
  }

  isExample(data) {
    const tags = Array.isArray(data.tags) ? data.tags : String(data.tags || "").split(/[\s,]+/);
    return data.example === true || tags.some((tag) => String(tag).replace(/^#/, "") === "example");
  }

  getAnalytics() {
    const config = this.getConfigFrontmatter();
    const paths = this.getConfiguredFolders(config);
    const folder = paths.daily;
    const today = moment().format("YYYY-MM-DD");
    const end = new Date(`${today}T12:00:00Z`);
    const days = Array.from({ length: this.analyticsDays }, (_, i) => {
      const date = new Date(end);
      date.setUTCDate(date.getUTCDate() - this.analyticsDays + 1 + i);
      return { date: date.toISOString().slice(0, 10), data: null, score: null };
    });
    const byDate = new Map(days.map((day) => [day.date, day]));
    const habits = new Set(this.getHabitKeys(config));
    let samples = 0;
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (!file.path.startsWith(`${folder}/`)) continue;
      const date = file.path.slice(folder.length + 1).replace(/\.md$/, "");
      const day = byDate.get(date);
      if (!day) continue;
      const data = this.getFrontmatter(file);
      if (this.isExample(data)) {
        samples += 1;
        if (!this.includeExamples) continue;
      }
      day.data = data;
      const scores = Object.entries(data)
        .filter(([key, value]) =>
          key.startsWith(config.dq_prefix || "dq_") &&
          ratingState(value).state === "recorded"
        )
        .map(([, value]) => value);
      day.score = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
      Object.keys(data).filter((key) => key.startsWith(config.habit_prefix || "habit_")).forEach((key) => habits.add(key));
    }
    const scored = days.filter((day) => day.score !== null);
    const average = scored.length ? scored.reduce((sum, day) => sum + day.score, 0) / scored.length : null;
    const retreatFolder = paths.retreats;
    const retreats = this.app.vault.getMarkdownFiles()
      .filter((file) => file.path.startsWith(`${retreatFolder}/`))
      .filter((file) => this.includeExamples || !this.isExample(this.getFrontmatter(file)))
      .sort((a, b) => b.path.localeCompare(a.path));
    const retreat = retreats.find((file) => Object.entries(this.getFrontmatter(file)).some(([key, value]) =>
      key.startsWith(config.wheel_prefix || "wheel_") && ratingState(value).state === "recorded"));
    const wheel = retreat ? Object.entries(this.getFrontmatter(retreat)).filter(([key, value]) =>
      key.startsWith(config.wheel_prefix || "wheel_") && ratingState(value).state === "recorded") : [];
    return { days, habits: [...habits], samples, average, scored: scored.length, wheel, retreat };
  }

  renderAnalytics(parent) {
    const model = this.getAnalytics();
    const section = parent.createEl("section", { cls: "life-os-analytics" });
    const heading = section.createDiv({ cls: "life-os-analytics-heading" });
    const copy = heading.createDiv();
    copy.createEl("h2", { text: "生活概览" });
    copy.createEl("p", { text: this.includeExamples
      ? "已包含示例笔记，图表可能含有演示数据。"
      : "展示已有的努力程度与习惯记录。空白日期表示没有数据，不代表零分。" });
    const controls = heading.createDiv({ cls: "life-os-chart-controls" });
    for (const count of [7, 30, 90]) {
      const button = controls.createEl("button", {
        text: `${count} 天`, attr: { "aria-pressed": String(this.analyticsDays === count) },
      });
      button.type = "button";
      button.addEventListener("click", () => { this.analyticsDays = count; this.render(); });
    }
    const sample = controls.createEl("button", {
      text: this.includeExamples ? "已包含示例" : "包含示例",
      attr: { "aria-pressed": String(this.includeExamples) },
    });
    sample.type = "button";
    sample.addEventListener("click", () => { this.includeExamples = !this.includeExamples; this.render(); });

    const grid = section.createDiv({ cls: "life-os-chart-grid" });
    const effort = grid.createDiv({ cls: "life-os-chart-card life-os-effort-chart" });
    effort.createEl("h3", { text: "每日努力程度" });
    effort.createEl("strong", { cls: "life-os-chart-number", text: model.average === null ? "暂无评分" : `${model.average.toFixed(1)} / 10` });
    effort.createEl("p", { text: `${model.scored} 天有评分 · 已记录每日问题的平均值` });
    const plot = effort.createDiv({ cls: "life-os-effort-plot", attr: { role: "list", "aria-label": "每日努力程度评分" } });
    for (const day of model.days) {
      const label = `${day.date}：${day.score === null ? "未记录评分" : `${day.score.toFixed(1)}/10 分`}`;
      const column = plot.createDiv({ cls: "life-os-effort-column", attr: { role: "listitem", "aria-label": label, title: label } });
      column.createDiv({ cls: day.score === null ? "life-os-effort-bar is-missing" : "life-os-effort-bar",
        attr: { style: `height:${day.score === null ? 2 : day.score * 10}%` } });
      if (day.data) {
        column.setAttribute("role", "button");
        column.setAttribute("tabindex", "0");
        const open = () => void this.openPath(`${this.getConfiguredFolders().daily}/${day.date}.md`);
        this.registerDomEvent(column, "click", open);
        this.registerDomEvent(column, "keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
      }
    }
    const axis = effort.createDiv({ cls: "life-os-chart-axis" });
    axis.createSpan({ text: model.days[0].date });
    axis.createSpan({ text: model.days[model.days.length - 1].date });
    const details = effort.createEl("details", { cls: "life-os-chart-details" });
    details.createEl("summary", { text: "查看每日数值" });
    const table = details.createEl("table", { cls: "life-os-chart-table" });
    const header = table.createEl("thead").createEl("tr");
    header.createEl("th", { text: "日期", attr: { scope: "col" } });
    header.createEl("th", { text: "努力程度（1 到 10 分）", attr: { scope: "col" } });
    const body = table.createEl("tbody");
    for (const day of model.days) {
      const row = body.createEl("tr");
      row.createEl("th", { text: day.date, attr: { scope: "row" } });
      row.createEl("td", { text: day.score === null ? "未记录" : day.score.toFixed(1) });
    }

    const wheel = grid.createDiv({ cls: "life-os-chart-card" });
    wheel.createEl("h3", { text: "生活领域" });
    wheel.createEl("p", { text: model.retreat ? `最近一次已评分的静修：${this.getFileTitle(model.retreat)}` : "完成下一次个人静修后，这里会显示生活领域评分。" });
    for (const [key, value] of model.wheel) {
      const row = wheel.createDiv({ cls: "life-os-wheel-row" });
      row.createSpan({ text: this.formatPropertyLabel(key) });
      const track = row.createDiv({ cls: "life-os-wheel-track", attr: { role: "meter", "aria-label": this.formatPropertyLabel(key), "aria-valuemin": "0", "aria-valuemax": "10", "aria-valuenow": String(value) } });
      track.createDiv({ cls: "life-os-wheel-fill", attr: { style: `width:${value * 10}%` } });
      row.createSpan({ text: `${value}/10` });
    }
    if (!model.wheel.length) wheel.createDiv({ cls: "life-os-live-empty", text: "暂无生活领域评分。可从“计划”打开“个人静修”并填写。" });
    if (model.retreat) this.addButton(wheel, { icon: "book-open", label: "打开已评分的静修笔记", description: "查看这些生活领域评分的来源。", onClick: () => this.openPath(model.retreat.path) });

    const habits = grid.createDiv({ cls: "life-os-chart-card life-os-habit-chart" });
    habits.createEl("h3", { text: "习惯节奏" });
    habits.createEl("p", { text: "实心表示已完成，浅色表示未勾选，空心表示未记录。悬停可查看日期详情。" });
    const matrix = habits.createDiv({ cls: "life-os-habit-matrix" });
    for (const key of model.habits) {
      const row = matrix.createDiv({ cls: "life-os-habit-row" });
      row.createSpan({ text: this.formatPropertyLabel(key) });
      const cells = row.createDiv({ cls: "life-os-habit-cells" });
      let done = 0, recorded = 0;
      for (const day of model.days) {
        const value = day.data?.[key];
        if (typeof value === "boolean") recorded += 1;
        if (value === true) done += 1;
        const label = `${day.date}, ${this.formatPropertyLabel(key)}: ${value === true ? "已完成" : value === false ? "未勾选" : "无记录"}`;
        cells.createSpan({ cls: `life-os-habit-cell ${value === true ? "is-done" : value === false ? "is-open" : "is-missing"}`,
          attr: { title: label, "aria-label": label, role: "img" } });
      }
      row.createSpan({ text: recorded ? `${done}/${recorded}` : "无数据" });
    }
    if (!model.habits.length) habits.createDiv({ cls: "life-os-live-empty", text: "请先在配置中添加习惯。" });
  }

  renderRail(parent) {
    const rail = parent.createEl("aside", {
      cls: "life-os-rail",
      attr: { "aria-label": "Life OS 导航" },
    });

    const brand = rail.createEl("button", {
      cls: "life-os-rail-brand",
      attr: { "aria-label": "打开 Life OS 首页" },
    });
    brand.type = "button";
    const mark = brand.createSpan();
    setIcon(mark, "compass");
    brand.createSpan({ text: "LIFE" });
    brand.addEventListener("click", () => {
      this.activeScreen = "home";
      this.render();
    });

    const nav = rail.createEl("nav", { cls: "life-os-nav" });
    for (const item of NAV_ITEMS) {
      const button = nav.createEl("button", {
        cls:
          this.activeScreen === item.id
            ? "life-os-nav-button is-active"
            : "life-os-nav-button",
        attr: {
          "aria-current":
            this.activeScreen === item.id ? "page" : "false",
          title: item.label,
        },
      });
      button.type = "button";
      const icon = button.createSpan();
      setIcon(icon, item.icon);
      button.createSpan({ text: item.label });
      button.addEventListener("click", () => {
        this.activeScreen = item.id;
        this.render();
      });
    }

    const local = rail.createDiv({ cls: "life-os-rail-foot" });
    const localIcon = local.createSpan();
    setIcon(localIcon, "hard-drive");
    local.createSpan({ text: "本地仓库" });
  }

  renderTopbar(parent) {
    const topbar = parent.createEl("header", { cls: "life-os-topbar" });
    const context = topbar.createDiv({ cls: "life-os-topbar-context" });
    context.createSpan({ text: "Life OS" });
    context.createEl("strong", { text: this.getScreenTitle() });

    const actions = topbar.createDiv({ cls: "life-os-topbar-actions" });
    this.addTopbarButton(actions, "search", "搜索", () => {
      this.runCommand("global-search:open", "搜索");
    });
    this.addTopbarButton(actions, "settings-2", "配置", () => {
      void this.openPath("Meta/Compass Config.md");
    });
    const display = actions.createEl("details", { cls: "life-os-display-options" });
    display.createEl("summary", { text: "视图" });
    const options = display.createDiv();
    options.createEl("p", { text: "这些选项仅影响当前视图，不会修改仓库设置。" });
    const density = options.createEl("button", { text: this.compactLayout ? "使用宽松间距" : "使用紧凑间距" });
    density.type = "button";
    this.registerDomEvent(density, "click", () => { this.compactLayout = !this.compactLayout; this.render(true); });
    const visuals = options.createEl("button", { text: this.showVisuals ? "隐藏可选图表" : "显示可选图表" });
    visuals.type = "button";
    this.registerDomEvent(visuals, "click", () => { this.showVisuals = !this.showVisuals; this.render(true); });
    if (["home", "today", "focus", "projects", "people", "create", "library", "ai"].includes(this.activeScreen)) {
      const local = options.createEl("button", { text: this.visualOptions[this.activeScreen] === false ? "显示此模块的图表" : "隐藏此模块的图表" });
      local.type = "button";
      this.registerDomEvent(local, "click", () => { this.visualOptions[this.activeScreen] = this.visualOptions[this.activeScreen] === false; this.render(true); });
    }
    const label = options.createEl("label", { text: "每个列表显示条数 " });
    const limit = label.createEl("select", { attr: { "aria-label": "每个列表显示条数" } });
    for (const count of [3, 6, 12]) limit.createEl("option", { text: String(count), attr: { value: String(count) } });
    limit.value = String(this.itemLimit);
    this.registerDomEvent(limit, "change", () => { this.itemLimit = Number(limit.value); this.render(true); });
    const reset = options.createEl("button", { text: "恢复视图默认设置" });
    reset.type = "button";
    this.registerDomEvent(reset, "click", () => { this.showVisuals = true; this.visualOptions = {}; this.itemLimit = 6; this.compactLayout = false; this.focusGroup = "all"; this.libraryStatus = "all"; this.libraryType = "all"; this.pipelinePath = null; this.render(true); });
    this.addTopbarButton(actions, "plus", "快速记录", () => {
      this.plugin.openCapture();
    }, true);
  }

  visualEnabled() { return this.showVisuals && this.visualOptions[this.activeScreen] !== false; }

  addTopbarButton(parent, iconName, label, onClick, primary = false) {
    const button = parent.createEl("button", {
      attr: { "aria-label": label, title: label },
      cls: primary
        ? "life-os-topbar-button is-primary"
        : "life-os-topbar-button",
    });
    button.type = "button";
    const icon = button.createSpan();
    setIcon(icon, iconName);
    button.createSpan({ text: label });
    button.addEventListener("click", onClick);
  }

  getScreenTitle() {
    return NAV_ITEMS.find((item) => item.id === this.activeScreen)?.label || "首页";
  }

  renderModule(shell) {
    const module = MODULES[this.activeScreen];
    if (!module) {
      this.activeScreen = "home";
      this.render();
      return;
    }

    const header = shell.createEl("header", { cls: "life-os-module-header" });
    header.createSpan({ cls: "life-os-eyebrow", text: module.eyebrow });
    header.createEl("h1", { text: module.title });
    header.createEl("p", { text: module.description });

    if (this.activeScreen === "today") {
      this.renderTodayLive(shell);
      this.renderTaskLive(shell, { limit: 5, attention: true });
    } else {
      this.renderModuleLive(shell);
    }

    if (this.activeScreen === "ai") this.renderSystemSummary(shell);
    this.renderActionSection(
      shell,
      "打开并操作",
      "下列入口会打开实际笔记、仪表盘或记录流程。",
      module.actions,
      (action) => {
        if (action.command) {
          this.runCommand(action.command, action.label);
        } else {
          this.openPath(action.path);
        }
      }
    );

    if (this.activeScreen === "ai") {
      const note = shell.createEl("section", { cls: "life-os-principle" });
      const icon = note.createSpan();
      setIcon(icon, "shield-check");
      const copy = note.createDiv();
      copy.createEl("strong", { text: "AI 辅助，人工授权" });
      copy.createEl("p", {
        text:
          "Life OS 可检索、总结和起草。发送内容前请检查上下文。人工审批是一项使用规则，并非所有连接工具都能强制执行的保证。",
      });
    }
  }

  renderTodayLive(parent) {
    const data = this.getTodayData();
    const section = parent.createEl("section", { cls: "life-os-today-live" });
    const heading = section.createDiv({ cls: "life-os-today-heading" });
    const copy = heading.createDiv();
    copy.createEl("h2", { text: "今日概况" });
    copy.createEl("p", {
      text: "这里只显示今天的属性，日记正文不会显示在此页面。",
    });

    if (!data.exists) {
      heading.createSpan({ cls: "life-os-progress-chip", text: "尚未开始" });
      const empty = section.createDiv({ cls: "life-os-today-empty" });
      const icon = empty.createSpan();
      setIcon(icon, "sunrise");
      const emptyCopy = empty.createDiv();
      emptyCopy.createEl("strong", { text: "创建今日笔记" });
      emptyCopy.createEl("p", {
        text: "Life OS 会使用你配置的每日问题和习惯。",
      });
      this.addButton(empty, {
        icon: "plus",
        label: "开始今天",
        description: "创建或打开今天的日记。",
        primary: true,
        onClick: () =>
          this.runCommand("quickadd:choice:lifeos-daily", "今日笔记"),
      });
      return;
    }

    const completed = data.questionRecorded + data.habitRecorded;
    const total = data.questions.length + data.habits.length;
    if (this.visualEnabled() && total) {
      const meter = section.createEl("progress", { cls: "life-os-checkin-meter", attr: { max: String(total), value: String(completed), "aria-label": `已记录 ${completed}/${total} 项每日检查属性；这不是完成分数` } });
      meter.textContent = `已记录 ${completed}/${total} 项`;
    }
    heading.createSpan({
      cls: "life-os-progress-chip is-active",
      text: total ? `已记录 ${completed}/${total} 项` : "已准备好",
    });

    const grid = section.createDiv({ cls: "life-os-today-grid" });
    this.renderTodayList(
      grid,
      "每日问题",
      "用 1 到 10 分评价努力程度。",
      data.questions,
      "line-chart"
    );
    this.renderTodayList(
      grid,
      "习惯",
      "记录只是信号，不是评价。",
      data.habits,
      "activity"
    );

    const actions = section.createDiv({ cls: "life-os-today-actions" });
    this.addButton(actions, {
      icon: "file-text",
      label: "打开日记",
      description: "查看今天的完整记录。",
      onClick: () => this.openPath(data.path),
    });
    this.addButton(actions, {
      icon: "message-circle-question",
      label: "每日问题",
      description: "进行引导式晚间回顾。",
      primary: true,
      onClick: () =>
        this.runCommand(
          "templater-obsidian:Templates/Daily Questions Prompt.md",
          "每日问题"
        ),
    });
  }

  renderTodayList(parent, title, description, rows, iconName) {
    const card = parent.createDiv({ cls: "life-os-today-card" });
    const heading = card.createDiv({ cls: "life-os-today-card-heading" });
    const icon = heading.createSpan();
    setIcon(icon, iconName);
    const copy = heading.createDiv();
    copy.createEl("h3", { text: title });
    copy.createEl("p", { text: description });

    const list = card.createDiv({ cls: "life-os-today-list" });
    for (const row of rows) {
      const item = list.createDiv({ cls: "life-os-today-row" });
      item.createSpan({ text: row.label });
      item.createSpan({
        cls: row.complete
          ? "life-os-today-value is-complete"
          : "life-os-today-value",
        text: row.display,
      });
    }
  }

  getTodayData() {
    const config = this.getConfigFrontmatter();
    const paths = this.getConfiguredFolders(config);
    const todayPath = `${paths.daily}/${moment().format("YYYY-MM-DD")}.md`;
    const todayFile = this.app.vault.getAbstractFileByPath(todayPath);
    const today = this.getFrontmatter(todayFile);
    const questionConfig = Array.isArray(config.questions) ? config.questions : [];
    const habitConfig = Array.isArray(config.habits) ? config.habits : [];

    const questions = questionConfig
      .map((question) => {
        const key = String(question?.key || question || "");
        const result = ratingState(today[key]);
        const recorded = result.state === "recorded";
        return {
          key,
          label:
            String(question?.text || "").trim() || this.formatPropertyLabel(key),
          state: result.state,
          recorded,
          complete: recorded,
          display: recorded
            ? `${result.value}/10`
            : result.state === "invalid"
              ? "无效数值"
              : "未评分",
        };
      })
      .filter((question) => question.key);
    const habits = habitConfig
      .map((habit) => String(habit || ""))
      .filter(Boolean)
      .map((key) => {
        const state = habitState(today[key]);
        return {
          key,
          label: this.formatPropertyLabel(key),
          state,
          recorded: state === "done" || state === "unchecked",
          complete: state === "done",
          display:
            state === "done"
              ? "已完成"
              : state === "unchecked"
                ? "未勾选"
                : state === "invalid"
                  ? "无效数值"
                  : "未记录",
        };
      });

    return {
      exists: todayFile instanceof TFile,
      path: todayPath,
      questions,
      habits,
      questionRecorded: questions.filter((question) => question.recorded).length,
      habitRecorded: habits.filter((habit) => habit.recorded).length,
      habitDone: habits.filter((habit) => habit.complete).length,
    };
  }

  formatPropertyLabel(key) {
    return PROPERTY_LABELS[key] || String(key)
      .replace(/^(dq|habit|wheel)_/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  renderModuleLive(parent) {
    if (this.activeScreen === "focus") {
      if (this.visualEnabled()) this.renderFocusGroups(parent);
      this.renderTaskLive(parent, { limit: this.itemLimit, group: this.visualEnabled() ? this.focusGroup : "all" });
    }

    if (this.activeScreen === "plan") {
      this.renderCalendar(parent);
      this.renderPlanLive(parent);
      return;
    }

    if (this.activeScreen === "review") {
      this.renderAnalytics(parent);
      this.renderReviewLive(parent);
      return;
    }

    if (this.activeScreen === "create") {
      this.renderPipelineLive(parent);
      return;
    }

    if (this.activeScreen === "ai") {
      this.renderAiLive(parent);
      return;
    }

    const collections = {
      focus: {
        title: "当前承诺",
        description: "当前需要关注的项目。",
        types: ["project"],
        icon: "crosshair",
        empty: "暂无进行中的项目。",
      },
      projects: {
        title: "项目动态",
        description: "标准项目文件夹中的进行中项目笔记。",
        types: ["project"],
        icon: "folder-kanban",
        empty: "暂无进行中的项目笔记。",
      },
      people: {
        title: "人物目录",
        description: "人物关系笔记保存在本地，可直接打开。",
        types: ["person"],
        icon: "users",
        empty: "暂无人物笔记。",
      },
      library: {
        title: "资料库书架",
        description: "带有类型属性的资料库笔记，包括读完的书籍和资料；已排除示例。",
        types: ["book"],
        icon: "library",
        empty: "暂无带类型属性的资料库笔记。请添加书籍或资料，并设置类型属性。",
      },
    };
    const collection = collections[this.activeScreen];
    if (collection) {
      this.renderCollectionLive(parent, collection);
    }
  }

  renderPlanLive(parent) {
    const paths = this.getConfiguredFolders();
    const horizons = [
      {
        icon: "sun",
        label: "今日",
        period: moment().locale("zh-cn").format("M月D日"),
        path: `${paths.daily}/${moment().format("YYYY-MM-DD")}.md`,
        command: "quickadd:choice:lifeos-daily",
      },
      {
        icon: "calendar-range",
        label: "本周",
        period: moment().locale("zh-cn").format("第 ww 周"),
        path: `${paths.weekly}/${moment().format("gggg-[W]ww")}.md`,
        command: "quickadd:choice:lifeos-weekly",
      },
      {
        icon: "compass",
        label: "本季度",
        period: moment().format("YYYY-[Q]Q"),
        path: `${paths.quarterly}/${moment().format("YYYY-[Q]Q")}.md`,
        command: "quickadd:choice:lifeos-quarterly",
      },
      {
        icon: "tent-tree",
        label: "个人静修",
        period: moment().format("YYYY-[Q]Q"),
        path: `${paths.retreats}/${moment().format("YYYY-[Q]Q")} Personal Retreat.md`,
        command: "quickadd:choice:lifeos-retreat",
      },
    ];
    const section = parent.createEl("section", { cls: "life-os-plan-live" });
    this.renderLiveHeading(
      section,
      "相互衔接的计划",
      "对应的标准笔记创建后，该时间层级即可使用。",
      `已创建 ${horizons.filter((item) => this.fileExists(item.path)).length}/${horizons.length} 篇笔记`
    );
    const grid = section.createDiv({ cls: "life-os-horizon-grid" });
    for (const horizon of horizons) {
      const ready = this.fileExists(horizon.path);
      const button = grid.createEl("button", { cls: "life-os-horizon-card" });
      button.type = "button";
      const icon = button.createSpan({ cls: "life-os-horizon-icon" });
      setIcon(icon, horizon.icon);
      const copy = button.createDiv();
      copy.createEl("strong", { text: horizon.label });
      copy.createSpan({ text: horizon.period });
      button.createSpan({
        cls: ready ? "life-os-record-status is-ready" : "life-os-record-status",
        text: ready ? "打开笔记" : "创建笔记",
      });
      this.registerDomEvent(button, "click", () => {
        if (ready) {
          void this.openPath(horizon.path);
        } else {
          this.runCommand(horizon.command, horizon.label);
        }
      });
    }
  }

  renderCalendar(parent) {
    const today = moment().format("YYYY-MM-DD");
    const base = new Date(`${today}T12:00:00Z`);
    const month = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + (this.calendarOffset || 0), 1, 12));
    const section = parent.createEl("section", { cls: "life-os-calendar" });
    const toolbar = section.createDiv({ cls: "life-os-calendar-toolbar" });
    toolbar.createEl("h2", { text: month.toLocaleDateString("zh-CN", { month: "long", year: "numeric", timeZone: "UTC" }) });
    for (const [label, delta] of [["上个月", -1], ["本月", 0], ["下个月", 1]]) {
      const button = toolbar.createEl("button", { text: label });
      button.type = "button";
      this.registerDomEvent(button, "click", () => { this.calendarOffset = delta ? (this.calendarOffset || 0) + delta : 0; this.render(); });
    }
    const grid = section.createDiv({ cls: "life-os-calendar-grid" });
    const firstDay = moment.localeData?.().firstDayOfWeek?.() ?? 1;
    for (let i = 0; i < 7; i++) grid.createDiv({ cls: "life-os-calendar-weekday", text: new Date(Date.UTC(2026, 0, 4 + (firstDay + i) % 7)).toLocaleDateString("zh-CN", { weekday: "short", timeZone: "UTC" }) });
    const offset = (month.getUTCDay() - firstDay + 7) % 7;
    const folder = this.getConfiguredFolders().daily;
    for (let i = 0; i < 42; i++) {
      const date = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1 - offset + i, 12));
      const iso = date.toISOString().slice(0, 10);
      const path = `${folder}/${iso}.md`;
      const exists = this.fileExists(path);
      const button = grid.createEl("button", { cls: `life-os-calendar-day${exists ? " is-present" : ""}${date.getUTCMonth() !== month.getUTCMonth() ? " is-outside" : ""}`, text: String(date.getUTCDate()), attr: { "aria-label": `${iso}：${exists ? "打开日记" : iso === today ? "创建今日笔记" : "无日记"}`, ...(iso === today ? { "aria-current": "date" } : {}) } });
      button.type = "button";
      button.disabled = !exists && iso !== today;
      this.registerDomEvent(button, "click", () => exists ? void this.openPath(path) : this.runCommand("quickadd:choice:lifeos-daily", "今日笔记"));
    }
    section.createEl("p", { cls: "life-os-calendar-help", text: "高亮日期已有日记。可以打开已有日记，或创建今天的日记；其他空白日期不可操作，也不会自动生成记录。" });
  }

  renderReviewLive(parent) {
    const config = this.getConfigFrontmatter();
    const paths = this.getConfiguredFolders(config);
    const questionKeys = this.getQuestionKeys(config);
    const habitKeys = this.getHabitKeys(config);
    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = moment().clone().subtract(offset, "days");
      const path = `${paths.daily}/${day.format("YYYY-MM-DD")}.md`;
      const file = this.app.vault.getAbstractFileByPath(path);
      const raw = this.getFrontmatter(file);
      const excluded = !this.includeExamples && this.isExample(raw);
      const data = excluded ? {} : raw;
      const metrics = this.summarizeDailyProperties(data, questionKeys, habitKeys);
      days.push({
        label: day.format("ddd"),
        exists: file instanceof TFile && !excluded,
        recorded: metrics.recorded,
        habitsDone: metrics.habitsDone,
        total: questionKeys.length + habitKeys.length,
      });
    }
    const activeDays = days.filter((day) => day.exists).length;
    const section = parent.createEl("section", { cls: "life-os-review-live" });
    this.renderLiveHeading(
      section,
      "近七日记录",
      "只统计属性填写情况，不显示日记正文。",
      `${activeDays} 篇日记`
    );
    const grid = section.createDiv({ cls: "life-os-week-grid" });
    for (const day of days) {
      const card = grid.createDiv({
        cls: day.exists ? "life-os-day-card is-present" : "life-os-day-card",
      });
      card.createEl("strong", { text: day.label });
      card.createSpan({
        text: day.exists ? `已记录 ${day.recorded}/${day.total} 项` : "无笔记",
      });
      const meter = card.createDiv({ cls: "life-os-day-meter" });
      const ratio = day.total ? day.recorded / day.total : 0;
      meter.createDiv({
        cls: "life-os-day-meter-fill",
        attr: { style: `width: ${Math.round(ratio * 100)}%` },
      });
    }
  }

  renderPipelineLive(parent) {
    const pipelines = [
      { type: "newsletter", label: "通讯", icon: "mail", path: "06 Writing/Newsletters/Newsletter Board.md" },
      { type: "youtube-script", label: "视频", icon: "video", path: "06 Writing/YouTube Scripts/YouTube Board.md" },
      { type: "article", label: "文章", icon: "newspaper", path: "06 Writing/Articles/Article Board.md" },
      { type: "course-lesson", label: "课程", icon: "graduation-cap", path: "06 Writing/Course Content/Course Board.md" },
    ];
    const files = this.app.vault.getMarkdownFiles();
    const section = parent.createEl("section", { cls: "life-os-pipeline-live" });
    this.renderLiveHeading(
      section,
      "创作工作台",
      "每条创作流程都对应 Markdown 笔记和看板。",
      `${pipelines.reduce((sum, pipeline) => sum + this.countType(files, pipeline.type), 0)} 篇笔记`
    );
    const grid = section.createDiv({ cls: "life-os-pipeline-grid" });
    for (const pipeline of pipelines) {
      const button = grid.createEl("button", { cls: "life-os-pipeline-card" });
      button.type = "button";
      const icon = button.createSpan();
      setIcon(icon, pipeline.icon);
      const copy = button.createDiv();
      copy.createEl("strong", { text: pipeline.label });
      copy.createSpan({ text: `${this.countType(files, pipeline.type)} 篇笔记` });
      const selected = (this.pipelinePath || pipelines[0].path) === pipeline.path;
      if (this.visualEnabled()) button.setAttribute("aria-pressed", String(selected));
      this.registerDomEvent(button, "click", () => {
        if (!this.visualEnabled()) { void this.openPath(pipeline.path); return; }
        this.pipelinePath = pipeline.path;
        this.render();
      });
      if (this.visualEnabled() && selected) {
        const file = this.app.vault.getAbstractFileByPath(pipeline.path);
        const cache = file instanceof TFile ? this.app.metadataCache.getFileCache(file) : null;
        const lanes = cache?.headings?.filter(heading => heading.level === 2) || [];
        const flow = section.createDiv({ cls: "life-os-workflow-lanes" });
        flow.createEl("h3", { text: pipeline.label });
        this.addButton(flow, { icon: "kanban", label: "打开看板", description: "在原始看板中编辑卡片。", onClick: () => this.openPath(pipeline.path) });
        if (!file || !cache || !lanes.length || !Array.isArray(cache.listItems)) {
          flow.createEl("p", { text: "暂时无法统计看板列数。请打开看板查看流程。" });
          continue;
        }
        if (this.isExample(this.getFrontmatter(file))) {
          flow.createEl("p", { text: "流程统计已排除示例看板。" });
          continue;
        }
        for (let i = 0; i < lanes.length; i++) {
          const start = lanes[i].position.start.line;
          const end = lanes[i + 1]?.position.start.line ?? Infinity;
          const cards = cache.listItems.filter(item => item.task !== undefined && item.position.start.line > start && item.position.start.line < end);
          const laneBox = flow.createDiv({ cls: "life-os-lane-preview" });
          const lane = laneBox.createEl("button", { text: `${lanes[i].heading} · ${cards.length}` });
          lane.type = "button";
          this.registerDomEvent(lane, "click", () => void this.openPath(pipeline.path, start + 1));
          const tasks = this.taskSnapshot?.tasks.filter(task => task.path === pipeline.path && task.line > start + 1 && task.line <= end) || [];
          for (const task of tasks.slice(0, 3)) {
            const item = laneBox.createEl("button", { cls: "life-os-lane-item", text: task.text });
            item.type = "button";
            this.registerDomEvent(item, "click", () => void this.openPath(task.path, task.line));
          }
    laneBox.createEl("p", { text: !this.taskSnapshot ? "正在加载待办项" : this.taskSnapshot.error ? "待办项索引不可用" : `显示 ${Math.min(tasks.length, 3)}/${tasks.length} 项已索引待办${this.taskSnapshot.state === "partial" ? " · 索引不完整" : ""}` });
        }
        flow.createEl("p", { text: "按看板实际标题统计复选项，包含已勾选的项目；此数值不是完成百分比。" });
      }
    }
  }

  renderAiLive(parent) {
    const agentSettings = this.pluginSettings("agent-client");
    const restSettings = this.pluginSettings("obsidian-local-rest-api");
    const agentLoaded = this.pluginLoaded("agent-client");
    const restLoaded = this.pluginLoaded("obsidian-local-rest-api");
    const permissionSetting =
      typeof agentSettings.autoAllowPermissions === "boolean"
        ? agentSettings.autoAllowPermissions
        : null;
    const sessionCount = Array.isArray(agentSettings.savedSessions)
      ? agentSettings.savedSessions.length
      : 0;
    const agentConfigured = agentLoaded && Boolean(agentSettings.defaultAgentId);
    const restConfigured = restLoaded && Boolean(restSettings.apiKey);
    const prompts = this.app.vault
      .getMarkdownFiles()
      .filter((file) => file.path.startsWith("Prompts/")).length;
    const checks = [
      {
        icon: "bot",
        label: "Agent Client",
        ready: agentConfigured,
        state: agentConfigured ? "已配置" : agentLoaded ? "已安装" : "不可用",
        detail: agentConfigured
          ? `${sessionCount} 个本地会话`
          : "仓库内助手界面",
      },
      {
        icon: "plug-zap",
        label: "本地 MCP 桥接",
        ready: restConfigured,
        state: restConfigured ? "已配置" : restLoaded ? "已安装" : "不可用",
        detail: restConfigured ? "本地服务器密钥已配置" : "本地工具连接",
      },
      {
        icon: "library",
        label: "提示词库",
        ready: prompts > 0,
        state: prompts > 0 ? "可用" : "不可用",
        detail: `${prompts} 个受控工作流`,
      },
      {
        icon: "shield-check",
        label: "权限规则",
        ready: agentLoaded && permissionSetting === false,
        state: !agentLoaded
          ? "不可用"
          : permissionSetting === false
            ? "手动提示词"
            : permissionSetting === true
              ? "自动批准已开启"
              : "未知",
        detail:
          permissionSetting === false
            ? "客户端设置已关闭自动批准。这里只显示配置，不代表每项操作都会被强制拦截。"
            : permissionSetting === true
              ? "客户端可能自动批准请求。这里只显示配置，不代表每项操作都会被强制拦截。"
              : "无法读取权限设置，因此无法确认审批是否受到强制执行。",
      },
    ];
    const ready = checks.filter((check) => check.ready).length;
    const section = parent.createEl("section", { cls: "life-os-ai-live" });
    this.renderLiveHeading(
      section,
      "AI 控制中心",
      "此处只显示本地能力状态。已安装不代表已认证或已连接。",
      `${ready}/${checks.length} 项可用`
    );
    if (this.visualEnabled()) {
      const flow = section.createEl("section", { cls: "life-os-connection-map", attr: { "aria-label": "AI 集成关系" } });
      flow.createEl("h3", { text: "各部分如何连接" });
      const diagram = flow.createDiv({ cls: "life-os-ai-diagram" });
      diagram.createDiv({ cls: "life-os-ai-node", text: "Life OS · 本地仪表盘" });
      diagram.createDiv({ cls: "life-os-ai-connector", text: "选定的上下文 →" });
      const hub = diagram.createDiv({ cls: "life-os-ai-node", text: `Agent Client · ${agentConfigured ? "已配置" : agentLoaded ? "已加载，仍需配置" : "不可用"}` });
      hub.createDiv({ text: "两条独立的集成路径 ↓" });
      const branches = diagram.createDiv({ cls: "life-os-ai-branches" });
      branches.createDiv({ cls: "life-os-ai-node", text: "服务提供方 · 此处未测试认证" });
      branches.createDiv({ cls: "life-os-ai-node", text: `可选的本地 MCP 工具 · ${restConfigured ? "已有密钥，未测试连接" : "未配置"}` });
      flow.createEl("p", { text: "这里只概览集成关系，不显示实时网络请求，也不会向服务提供方发起请求。发送前请检查所选上下文和权限。" });
    }
    const grid = section.createDiv({ cls: "life-os-ai-check-grid" });
    for (const check of checks) {
      const card = grid.createDiv({
        cls: check.ready ? "life-os-ai-check is-ready" : "life-os-ai-check",
      });
      const icon = card.createSpan();
      setIcon(icon, check.icon);
      const copy = card.createDiv();
      copy.createEl("strong", { text: check.label });
      copy.createSpan({ text: check.detail });
      card.createSpan({
        cls: "life-os-ai-state",
        text: check.state,
      });
    }
  }

  renderCollectionLive(parent, options) {
    const records = this.app.vault
      .getMarkdownFiles()
      .filter((file) => this.isDomainRecord(file))
      .filter((file) => this.activeScreen === "library" ? Boolean(this.getFrontmatter(file).type) : options.types.includes(String(this.getFrontmatter(file).type || "")))
      .filter((file) => this.activeScreen !== "library" || (file.path.startsWith("07 Library/") && !this.isExample(this.getFrontmatter(file))))
      .filter((file) => {
        const status = String(this.getFrontmatter(file).status || "").toLowerCase();
        return this.activeScreen === "library" || !["done", "complete", "completed", "archived"].includes(status);
      })
      .sort(
        (left, right) =>
          (right.stat?.mtime || 0) - (left.stat?.mtime || 0)
      );
    const section = parent.createEl("section", { cls: "life-os-collection-live" });
    this.renderLiveHeading(
      section,
      options.title,
      options.description,
      `${records.length} 篇笔记`
    );
    if (!records.length) {
      section.createDiv({ cls: "life-os-live-empty", text: options.empty });
      return;
    }
    let visible = records;
    if (this.activeScreen === "library") {
      const typeLabel = section.createEl("label", { text: "类型 " });
      const typeSelect = typeLabel.createEl("select", { attr: { "aria-label": "资料类型" } });
      const types = [...new Set(records.map(file => String(this.getFrontmatter(file).type)))].sort();
      if (!types.includes(this.libraryType)) this.libraryType = "all";
      for (const type of ["all", ...types]) typeSelect.createEl("option", { text: type === "all" ? "所有类型" : recordLabel(type, RECORD_TYPE_LABELS, "未设置"), attr: { value: type } });
      typeSelect.value = this.libraryType;
      this.registerDomEvent(typeSelect, "change", () => { this.libraryType = typeSelect.value; this.render(); });
      const label = section.createEl("label", { text: "资料状态 " });
      const select = label.createEl("select", { attr: { "aria-label": "资料状态" } });
      const statuses = [...new Set(records.map(file => String(this.getFrontmatter(file).status || "未设置")))].sort();
      for (const value of ["all", ...statuses]) select.createEl("option", { text: value === "all" ? "所有状态" : recordLabel(value, RECORD_STATUS_LABELS, "未设置"), attr: { value } });
      if (!statuses.includes(this.libraryStatus)) this.libraryStatus = "all";
      select.value = this.libraryStatus;
      this.registerDomEvent(select, "change", () => { this.libraryStatus = select.value; this.render(); });
      visible = records.filter(file => (this.libraryStatus === "all" || String(this.getFrontmatter(file).status || "未设置") === this.libraryStatus) && (this.libraryType === "all" || String(this.getFrontmatter(file).type) === this.libraryType));
    }
    section.createEl("p", { text: `显示 ${Math.min(visible.length, this.itemLimit)}/${visible.length} 篇匹配笔记。` });
    const grid = section.createDiv({ cls: "life-os-record-grid" });
    for (const file of visible.slice(0, this.itemLimit)) {
      const data = this.getFrontmatter(file);
      const button = grid.createEl("button", { cls: "life-os-record-card" });
      button.type = "button";
      if (this.activeScreen === "library" && this.visualEnabled()) {
        button.addClass("life-os-shelf-card");
        const cover = String(data.cover || "").replace(/^!?\[\[/, "").replace(/\]\]$/, "").split("|")[0];
        const imageFile = !/^(?:[a-z]+:|\/)/i.test(cover) && /\.(?:png|jpe?g|webp|gif)$/i.test(cover) ? this.app.metadataCache.getFirstLinkpathDest?.(cover, file.path) : null;
        if (imageFile instanceof TFile && this.app.vault.getResourcePath) button.createEl("img", { cls: "life-os-book-cover", attr: { src: this.app.vault.getResourcePath(imageFile), alt: "", loading: "lazy" } });
        else button.createDiv({ cls: "life-os-book-cover life-os-book-fallback", text: recordLabel(data.type, RECORD_TYPE_LABELS, "笔记") });
      }
      const icon = button.createSpan({ cls: "life-os-record-icon" });
      setIcon(icon, options.icon);
      const copy = button.createDiv();
      copy.createEl("strong", { text: this.getFileTitle(file) });
      copy.createSpan({ text: recordLabel(data.status, RECORD_STATUS_LABELS, "未设置状态") });
      if (this.visualEnabled() && ["projects", "people"].includes(this.activeScreen)) {
        const tasks = this.tasksForRecord(file, this.activeScreen === "projects" ? "project" : "p");
        copy.createSpan({ cls: "life-os-record-metrics", attr: { title: "计数依据明确的路由标签，不推断任务归属。" }, text: !this.taskSnapshot || this.taskSnapshot.error ? "任务索引不可用" : `${tasks.length} 项带标签的未完成任务 · ${tasks.filter(task => task.overdue).length} 项逾期${this.taskSnapshot.state === "partial" ? " · 索引不完整" : ""}` });
      }
      const arrow = button.createSpan({ cls: "life-os-record-arrow" });
      setIcon(arrow, "arrow-up-right");
      this.registerDomEvent(button, "click", () => void this.openPath(file.path));
    }
    if (this.visualEnabled() && this.activeScreen === "people") {
      const discussion = section.createDiv({ cls: "life-os-discussion-queue" });
      discussion.createEl("h3", { text: "待讨论事项" });
      const entries = visible.flatMap(file => this.tasksForRecord(file, "p").filter(task => task.discuss).map(task => ({ file, task })));
      discussion.createEl("p", { text: this.taskSnapshot && !this.taskSnapshot.error ? `${entries.length} 项已索引的待讨论任务${this.taskSnapshot.state === "partial" ? " · 索引不完整" : ""}。仅统计明确的人物标签。` : "任务索引不可用。" });
      for (const {file, task} of entries.slice(0, this.itemLimit)) {
        const button = discussion.createEl("button", { text: `${this.getFileTitle(file)} · ${task.text}` });
        button.type = "button";
        this.registerDomEvent(button, "click", () => void this.openPath(task.path, task.line));
      }
    }
  }

  tasksForRecord(file, prefix) {
    const slug = this.getFileTitle(file).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
    const tag = `#${prefix}/${slug}`;
    return (this.taskSnapshot?.tasks || []).filter(task => task.text.split(/\s+/).includes(tag));
  }

  renderLiveHeading(parent, title, description, status) {
    const heading = parent.createDiv({ cls: "life-os-live-heading" });
    const copy = heading.createDiv();
    copy.createEl("h2", { text: title });
    copy.createEl("p", { text: description });
    heading.createSpan({ cls: "life-os-progress-chip is-active", text: status });
  }

  getFrontmatter(file) {
    return file instanceof TFile
      ? this.app.metadataCache.getFileCache(file)?.frontmatter || {}
      : {};
  }

  getConfigFrontmatter() {
    return this.getFrontmatter(
      this.app.vault.getAbstractFileByPath("Meta/Compass Config.md")
    );
  }

  getConfiguredFolders(config = this.getConfigFrontmatter()) {
    return {
      daily: normalizeFolder(config.daily_folder, DEFAULT_FOLDERS.daily),
      weekly: normalizeFolder(config.weekly_folder, DEFAULT_FOLDERS.weekly),
      quarterly: normalizeFolder(config.quarterly_folder, DEFAULT_FOLDERS.quarterly),
      retreats: normalizeFolder(config.retreat_folder, DEFAULT_FOLDERS.retreats),
      projects: normalizeFolder(config.projects_folder, DEFAULT_FOLDERS.projects),
    };
  }

  summarizeDailyProperties(data, questionKeys, habitKeys) {
    const questionsRecorded = questionKeys.filter(
      (key) => ratingState(data[key]).state === "recorded"
    ).length;
    const habitStates = habitKeys.map((key) => habitState(data[key]));
    const habitsRecorded = habitStates.filter(
      (state) => state === "done" || state === "unchecked"
    ).length;
    return {
      questionsRecorded,
      habitsRecorded,
      habitsDone: habitStates.filter((state) => state === "done").length,
      recorded: questionsRecorded + habitsRecorded,
    };
  }

  getQuestionKeys(config) {
    const questions = Array.isArray(config.questions) ? config.questions : [];
    return questions
      .map((question) => String(question?.key || question || ""))
      .filter(Boolean);
  }

  getHabitKeys(config) {
    return (Array.isArray(config.habits) ? config.habits : [])
      .map((habit) => String(habit || ""))
      .filter(Boolean);
  }

  countType(files, type) {
    return files.filter(
      (file) => this.isDomainRecord(file) && String(this.getFrontmatter(file).type || "") === type
    ).length;
  }

  isDomainRecord(file) {
    const projects = `${this.getConfiguredFolders().projects}/`;
    return [projects, "05 People/", "06 Writing/", "07 Library/"]
      .some((folder) => file.path.startsWith(folder)) &&
      (this.includeExamples || !this.isExample(this.getFrontmatter(file)));
  }

  fileExists(path) {
    return this.app.vault.getAbstractFileByPath(path) instanceof TFile;
  }

  getFileTitle(file) {
    return file.basename || file.path.split("/").pop().replace(/\.md$/i, "");
  }

  resolveTaskStatus(symbol) {
    const normalized = symbol === "" ? " " : String(symbol || "");
    return TASK_STATUS_TYPES[normalized] || "unknown";
  }

  parseTaskLine(line, statusSymbol, file, lineNumber, today) {
    const match = line.match(/^\s*(?:[-+*]|\d+[.)])\s+\[([^\]])\]\s*(.*)$/u);
    if (!match || match[1] !== statusSymbol) {
      return null;
    }
    const raw = match[2].trim();
    const due = raw.match(/📅\s*(\d{4}-\d{2}-\d{2})/)?.[1] || "";
    const scheduled = raw.match(/⏳\s*(\d{4}-\d{2}-\d{2})/)?.[1] || "";
    const overdue = Boolean(due && due < today);
    const dueToday = due === today;
    const scheduledToday = scheduled === today;
    const high = raw.includes("⏫") || raw.includes("🔺");
    const discuss = /(^|\s)#discuss(?:\s|$)/.test(raw);
    const text = raw
      .replace(/\s*[🛫⏳📅✅❌➕]\s*\d{4}-\d{2}-\d{2}/gu, "")
      .replace(/\s*[🔺⏫🔼🔽⏬]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
    return {
      text,
      due,
      scheduled,
      overdue,
      dueToday,
      scheduledToday,
      high,
      discuss,
      path: file.path,
      line: lineNumber,
    };
  }

  async loadTaskSnapshot() {
    const paths = this.getConfiguredFolders();
    const sources = [
      "08 Tasks/Tasks.md",
      `${paths.projects}/`,
      "05 People/",
      "06 Writing/",
    ];
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) =>
        sources.some((source) =>
          source.endsWith("/") ? file.path.startsWith(source) : file.path === source
        )
      );
    const today = moment().format("YYYY-MM-DD");
    const tasks = [];
    const exampleFiles = files.filter((file) => this.isExample(this.getFrontmatter(file)));
    const indexFiles = files.filter((file) => !this.isExample(this.getFrontmatter(file)));

    try {
      const contents = await Promise.all(
        indexFiles.map(async (file) => {
          const cache = this.app.metadataCache.getFileCache(file);
          if (!cache) {
            return {
              file,
              content: "",
              listItems: [],
              error: "元数据不可用",
              errorType: "metadata",
            };
          }
          try {
            return {
              file,
              content: await this.app.vault.cachedRead(file),
              listItems: Array.isArray(cache.listItems) ? cache.listItems : [],
              error: "",
              errorType: "",
            };
          } catch (error) {
            return {
              file,
              content: "",
              listItems: [],
              error: error?.message || "文件无法读取",
              errorType: "read",
            };
          }
        })
      );
      let unresolvedStatuses = 0;
      let malformedItems = 0;
      for (const { file, content, listItems, error } of contents) {
        if (error) {
          continue;
        }
        const lines = content.split(/\r?\n/);
        for (const item of listItems) {
          if (typeof item.task !== "string") {
            continue;
          }
          const lineIndex = item.position?.start?.line;
          if (!Number.isInteger(lineIndex) || lineIndex < 0 || lineIndex >= lines.length) {
            malformedItems += 1;
            continue;
          }
          const symbol = item.task === "" ? " " : item.task;
          const status = this.resolveTaskStatus(symbol);
          if (status === "unknown") {
            unresolvedStatuses += 1;
            continue;
          }
          if (status !== "open") {
            continue;
          }
          const task = this.parseTaskLine(
            lines[lineIndex],
            symbol,
            file,
            lineIndex + 1,
            today
          );
          if (!task) {
            malformedItems += 1;
            continue;
          }
          tasks.push(task);
        }
      }
      tasks.sort((left, right) => {
        const rank = (task) =>
          task.overdue
            ? 0
            : task.dueToday || task.scheduledToday
              ? 1
              : task.high
                ? 2
                : task.due || task.scheduled
                  ? 3
                  : 4;
        const sortDate = (task) => task.due || task.scheduled || "9999-99-99";
        return (
          rank(left) - rank(right) ||
          sortDate(left).localeCompare(sortDate(right)) ||
          left.path.localeCompare(right.path) ||
          left.line - right.line ||
          left.text.localeCompare(right.text)
        );
      });
      const skipped = contents.filter((item) => item.error).length;
      return {
        tasks,
        error: "",
        state: skipped || unresolvedStatuses || malformedItems ? "partial" : "ready",
        skipped,
        missingMetadata: contents.filter((item) => item.errorType === "metadata").length,
        unresolvedStatuses,
        malformedItems,
        examplesExcluded: exampleFiles.length,
        candidateFiles: files.length,
      };
    } catch (error) {
      return {
        tasks: [],
        error: error?.message || "任务索引不可用",
        state: "unavailable",
        skipped: files.length,
        missingMetadata: 0,
        unresolvedStatuses: 0,
        malformedItems: 0,
        examplesExcluded: exampleFiles.length,
        candidateFiles: files.length,
      };
    }
  }

  taskGroup(task) {
    if (task.overdue) return "overdue";
    if (task.dueToday || task.scheduledToday) return "today";
    const today = moment().format("YYYY-MM-DD");
    if ((task.due && task.due > today) || (task.scheduled && task.scheduled > today)) return "upcoming";
    return "unscheduled";
  }

  renderFocusGroups(parent) {
    const section = parent.createDiv({ cls: "life-os-focus-groups" });
    section.createEl("h2", { text: "注意力分布" });
    section.createEl("p", { text: "每个已索引的未完成任务只归入一组。安排日期已过、但没有当前到期日的任务归入“其他”。索引不完整时可能遗漏任务。" });
    for (const [id, label] of [["all", "全部"], ["overdue", "逾期"], ["today", "今日"], ["upcoming", "即将到期"], ["unscheduled", "未安排／其他"]]) {
      const count = this.taskSnapshot?.tasks.filter(task => id === "all" || this.taskGroup(task) === id).length;
      const button = section.createEl("button", { text: `${label} · ${count ?? "正在加载"}`, attr: { "aria-pressed": String(this.focusGroup === id) } });
      button.type = "button";
      this.registerDomEvent(button, "click", () => { this.focusGroup = id; this.render(); });
    }
    const total = this.taskSnapshot?.tasks.length || 0;
    if (total) {
      const bar = section.createDiv({ cls: "life-os-workload-bar", attr: { "aria-label": "已索引未完成任务的分布" } });
      for (const [id, label] of [["overdue", "逾期"], ["today", "今日"], ["upcoming", "即将到期"], ["unscheduled", "未安排／其他"]]) {
        const count = this.taskSnapshot.tasks.filter(task => this.taskGroup(task) === id).length;
        if (!count) continue;
        const segment = bar.createEl("button", { cls: `life-os-workload-segment is-${id}`, attr: { style: `flex:${count}`, "aria-label": `${label}：${count}/${total} 项`, title: `${label}：${count}/${total} 项` } });
        segment.type = "button";
        this.registerDomEvent(segment, "click", () => { this.focusGroup = id; this.render(); });
      }
    }
  }

  renderTaskLive(parent, { limit = 7, attention = false, group = "all" } = {}) {
    const snapshot = this.taskSnapshot;
    const section = parent.createEl("section", { cls: "life-os-task-live" });
    const coverage = snapshot
      ? [
          `${snapshot.tasks.length} 项未完成`,
          snapshot.skipped - snapshot.missingMetadata > 0
            ? `${snapshot.skipped - snapshot.missingMetadata} 个文件无法读取`
            : "",
          snapshot.missingMetadata
            ? `${snapshot.missingMetadata} 个文件的元数据待加载`
            : "",
          snapshot.unresolvedStatuses
            ? `${snapshot.unresolvedStatuses} 项状态无法识别`
            : "",
          snapshot.examplesExcluded
            ? `${snapshot.examplesExcluded} 个示例已排除`
            : "",
        ]
          .filter(Boolean)
          .join(", ")
      : "正在加载";
    this.renderLiveHeading(
      section,
      attention ? "需要关注" : "任务动态",
      attention ? "包括逾期、今天到期、今天安排或高优先级任务。点击任务可打开原始笔记。" : "汇总任务总表、项目、人物和写作笔记中的未完成任务。",
      coverage
    );

    if (!snapshot) {
      section.createDiv({ cls: "life-os-live-empty", text: "正在加载本地任务…" });
      return;
    }
    if (snapshot.error) {
      section.createDiv({ cls: "life-os-live-empty", text: snapshot.error });
      return;
    }
    if (!snapshot.tasks.length) {
      section.createDiv({
        cls: "life-os-live-empty",
        text:
          snapshot.state === "partial"
            ? "索引中没有未完成任务，部分任务数据可能无法分类。"
            : "没有找到未完成任务。",
      });
      return;
    }

    const selected = attention ? snapshot.tasks.filter(task => task.overdue || task.dueToday || task.scheduledToday || task.high) : snapshot.tasks.filter(task => group === "all" || this.taskGroup(task) === group);
    if (!selected.length) section.createDiv({ cls: "life-os-live-empty", text: attention ? "已索引任务中没有紧急事项，其他未完成任务仍列在下方。" : "此分组中没有已索引任务。" });
    const list = section.createDiv({ cls: "life-os-task-list" });
    for (const task of selected.slice(0, limit)) {
      const button = list.createEl("button", {
        cls: task.overdue
          ? "life-os-task-row is-overdue"
          : task.dueToday || task.scheduledToday
            ? "life-os-task-row is-today"
            : "life-os-task-row",
      });
      button.type = "button";
      const marker = button.createSpan({ cls: "life-os-task-marker" });
      setIcon(marker, task.discuss ? "messages-square" : "circle");
      const copy = button.createDiv();
      copy.createEl("strong", { text: task.text });
      copy.createSpan({ text: this.getTaskContext(task) });
      if (task.high) {
        button.createSpan({ cls: "life-os-task-priority", text: "高" });
      }
      this.registerDomEvent(button, "click", () => void this.openPath(task.path, task.line));
    }
    this.addButton(section, { icon: "list-checks", label: "所有任务", description: !selected.length ? `查看全部 ${snapshot.tasks.length} 项已索引未完成任务。` : `显示 ${Math.min(selected.length, limit)}/${selected.length} 项匹配任务。`, onClick: () => this.openPath("00 Dashboards/Task Dashboard.md") });
  }

  getTaskContext(task) {
    if (task.overdue) {
      return `逾期 · ${task.due}`;
    }
    if (task.dueToday) {
      return "今天到期";
    }
    if (task.scheduledToday) {
      return "安排在今天";
    }
    if (task.due) {
      return `到期 ${task.due}`;
    }
    if (task.scheduled) {
      return `安排在 ${task.scheduled}`;
    }
    return this.getFileTitle({ path: task.path });
  }

  renderSystemSummary(parent) {
    const stats = this.getSystemStats();
    const section = parent.createEl("section", { cls: "life-os-summary" });
    section.createEl("h2", { text: "实时状态" });
    const grid = section.createDiv({ cls: "life-os-stat-grid" });

    for (const stat of stats) {
      const card = grid.createDiv({ cls: "life-os-stat" });
      const icon = card.createSpan({ cls: "life-os-stat-icon" });
      setIcon(icon, stat.icon);
      const copy = card.createDiv();
      copy.createEl("strong", { text: String(stat.value) });
      copy.createSpan({ text: stat.label });
    }
  }

  renderSetupBanner(parent) {
    const setupPath = "00 Dashboards/Setup.md";
    const setupFile = this.app.vault.getAbstractFileByPath(setupPath);
    const status = String(this.getFrontmatter(setupFile).status || "open").toLowerCase();
    if (status === "done" || status === "complete" || status === "completed") {
      return;
    }

    const banner = parent.createEl("section", { cls: "life-os-setup-banner" });
    const icon = banner.createSpan({ cls: "life-os-setup-icon" });
    setIcon(icon, "route");
    const copy = banner.createDiv();
    copy.createEl("strong", { text: "完成 Life OS 设置" });
    copy.createEl("p", {
      text: "依赖自动化或 AI 连接前，请先完成引导式设置清单。",
    });
    this.addButton(banner, {
      icon: "arrow-right",
      label: "继续设置",
      description: "查看设置清单。",
      onClick: () => this.openPath(setupPath),
    });
  }

  getSystemStats() {
    const paths = this.getConfiguredFolders();
    const files = this.app.vault.getMarkdownFiles().filter((file) => this.isDomainRecord(file));
    const frontmatter = (file) =>
      this.app.metadataCache.getFileCache(file)?.frontmatter || {};
    const typeCount = (types) =>
      files.filter((file) => types.includes(String(frontmatter(file).type || ""))).length;

    const activeProjects = files.filter((file) => {
      const data = frontmatter(file);
      const status = String(data.status || "").toLowerCase();
      return (
        data.type === "project" &&
        !["done", "complete", "completed", "archived"].includes(status)
      );
    }).length;

    const todayPath = `${paths.daily}/${moment().format("YYYY-MM-DD")}.md`;
    const weekPath = `${paths.weekly}/${moment().format("gggg-[W]ww")}.md`;
    const aiReady =
      this.pluginLoaded("agent-client") &&
      this.pluginLoaded("obsidian-local-rest-api");

    return [
      {
        icon: "calendar-check",
        value: this.app.vault.getAbstractFileByPath(todayPath) ? "已准备好" : "尚未创建",
        label: "今日",
      },
      {
        icon: "calendar-range",
        value: this.app.vault.getAbstractFileByPath(weekPath) ? "已准备好" : "尚未创建",
        label: "本周",
      },
      { icon: "folder-kanban", value: activeProjects, label: "进行中的项目" },
      { icon: "users", value: typeCount(["person"]), label: "人物" },
      {
        icon: "pen-tool",
        value: typeCount(["newsletter", "youtube-script", "article", "course-lesson"]),
        label: "创作笔记",
      },
      {
        icon: "sparkles",
        value: aiReady ? "已加载" : "不可用",
        label: "AI 工具",
      },
    ];
  }

  renderActionSection(parent, title, description, actions, onSelect) {
    const section = parent.createEl("section", {
      cls: "life-os-section",
    });

    const heading = section.createDiv({ cls: "life-os-section-heading" });
    heading.createEl("h2", { text: title });
    heading.createEl("p", { text: description });

    const grid = section.createDiv({ cls: "life-os-grid" });

    for (const action of actions) {
      this.addButton(grid, {
        icon: action.icon,
        label: action.label,
        description: action.description,
        onClick: () => onSelect(action),
      });
    }
  }

  addButton(parent, options) {
    const button = parent.createEl("button", {
      cls: options.primary
        ? "life-os-action is-primary"
        : "life-os-action",
    });

    button.type = "button";

    const icon = button.createSpan({ cls: "life-os-action-icon" });
    setIcon(icon, options.icon);

    const copy = button.createSpan({ cls: "life-os-action-copy" });
    copy.createSpan({
      cls: "life-os-action-label",
      text: options.label,
    });
    copy.createSpan({
      cls: "life-os-action-description",
      text: options.description,
    });

    this.registerDomEvent(button, "click", () => {
      void options.onClick();
    });

    return button;
  }

  addStatus(parent, iconName, label, active) {
    const chip = parent.createSpan({
      cls: active
        ? "life-os-status is-active"
        : "life-os-status is-inactive",
    });

    const icon = chip.createSpan();
    setIcon(icon, iconName);
    chip.createSpan({ text: label });
  }

  runCommand(commandId, label) {
    return this.plugin.runCommand(commandId, label);
  }

  async openPath(path, line = null) {
    if (path === `${DEFAULT_FOLDERS.projects}/Projects Board.md`) {
      path = `${this.getConfiguredFolders().projects}/Projects Board.md`;
    }
    const file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      new Notice(`Life OS 找不到 ${path}。`);
      return;
    }

    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.openFile(file, Number.isInteger(line) && line > 0 ? { eState: { line: line - 1 } } : {});
    const editor = leaf.view?.editor;
    if (editor && Number.isInteger(line) && line > 0) {
      const position = { line: line - 1, ch: 0 };
      editor.setCursor(position);
      editor.scrollIntoView?.({ from: position, to: position }, true);
    }
    await this.app.workspace.revealLeaf(leaf);
  }

  pluginLoaded(id) {
    return Boolean(this.app.plugins?.getPlugin?.(id));
  }

  pluginSettings(id) {
    return this.app.plugins?.getPlugin?.(id)?.settings || {};
  }
}

// Original Canvas renderer inspired by SEO OS's brain-shaped knowledge map.
// Positions are decorative; every displayed edge comes from resolved vault links.
class LifeOSBrainRenderer extends Component {
  constructor(app, contentEl, compact = false) {
    super();
    this.app = app;
    this.contentEl = contentEl;
    this.compact = compact;
    this.panX = 0;
    this.panY = 0;
    this.yaw = 0.28;
    this.pitch = -0.12;
    this.labelMode = compact ? "off" : "auto";
    this.zoom = 1;
    this.query = "";
    this.region = "all";
    this.selected = null;
    this.hovered = null;
    this.nodes = [];
    this.edges = [];
    this.projected = [];
    this.regions = [
      { id: "direction", name: "方向与项目", color: "#ff906b" },
      { id: "memory", name: "日记与反思", color: "#c095e8" },
      { id: "people", name: "人物", color: "#e5b96a" },
      { id: "knowledge", name: "知识与想法", color: "#6fbdd8" },
      { id: "practice", name: "任务与系统", color: "#82c3a5" },
    ];
  }
  getViewType() { return "life-os-brain"; }
  getDisplayText() { return "Life OS 知识图谱"; }
  getIcon() { return "brain"; }
  async onOpen() {
    const root = this.contentEl;
    root.empty(); root.addClass("life-os-brain");
    const header = root.createDiv({ cls: "life-os-brain-header" });
    const title = header.createDiv();
    title.createEl("h2", { text: "相互关联的知识图谱" });
    this.summary = title.createEl("p", { text: "正在读取仓库链接…", attr: { "aria-live": "polite" } });
    const controls = header.createDiv({ cls: "life-os-brain-controls" });
    const search = controls.createEl("input", { attr: { type: "search", placeholder: "查找笔记…", "aria-label": "搜索知识图谱中的笔记" } });
    this.registerDomEvent(search, "input", () => { this.query = search.value.toLowerCase(); this.update(); });
    const reset = controls.createEl("button", { text: "重置视图" });
    this.registerDomEvent(reset, "click", () => { this.panX = 0; this.panY = 0; this.yaw = 0.28; this.pitch = -0.12; this.zoom = 1; this.clearHover(); });
    const labels = controls.createEl("select", { attr: { "aria-label": "笔记标签" } });
    for (const [value, text] of [["auto", "标签：自动"], ["all", "标签：全部"], ["off", "标签：仅悬停时显示"]]) labels.createEl("option", { text, attr: { value } });
    this.registerDomEvent(labels, "change", () => { this.labelMode = labels.value; this.draw(); });
    const standard = controls.createEl("button", { text: "标准关系图" });
    this.registerDomEvent(standard, "click", () => {
      if (!this.app.commands.executeCommandById("graph:open")) new Notice("请先启用 Obsidian 核心插件“关系图谱”。");
    });
    this.filters = root.createDiv({ cls: "life-os-brain-filters", attr: { "aria-label": "知识图谱分区" } });
    for (const region of [{ id: "all", name: "所有分区", color: "#c4cecc" }, ...this.regions]) {
      const button = this.filters.createEl("button", { text: region.name, attr: { "aria-pressed": String(region.id === this.region), style: `--region-color:${region.color}` } });
      this.registerDomEvent(button, "click", () => {
        this.region = region.id;
        [...this.filters.children].forEach((child) => child.setAttribute("aria-pressed", String(child === button)));
        this.update();
      });
    }
    const body = root.createDiv({ cls: "life-os-brain-body" });
    this.stage = body.createDiv({ cls: "life-os-brain-stage" });
    this.canvas = this.stage.createEl("canvas", { attr: { tabindex: "0", "aria-label": "三维知识图谱：拖动旋转，按住 Shift 拖动平移，滚轮缩放，方向键旋转。可在旁边的列表浏览笔记。" } });
    this.caption = this.stage.createDiv({ cls: "life-os-brain-caption", text: "拖动旋转 · Shift 拖动平移 · 滚轮缩放" });
    this.tooltip = this.stage.createDiv({ cls: "life-os-brain-tooltip", attr: { role: "tooltip" } });
    this.tooltip.hidden = true;
    this.panel = body.createEl("aside", { cls: "life-os-brain-panel", attr: { "aria-label": "笔记与关联" } });
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) this.caption.setText("画布不可用。请在列表中浏览和打开笔记。");
    let drag = null;
    this.registerDomEvent(this.canvas, "pointerdown", (event) => {
      this.clearHover();
      drag = { x: event.clientX, y: event.clientY, distance: 0 };
      this.canvas.setPointerCapture(event.pointerId);
    });
    this.registerDomEvent(this.canvas, "pointermove", (event) => {
      if (!drag) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const hit = this.hitTest(x, y);
        const changed = this.hovered !== (hit?.node.path || null);
        this.hovered = hit?.node.path || null;
        this.tooltip.empty();
        this.tooltip.hidden = !hit;
        if (hit) {
          this.tooltip.createEl("strong", { text: hit.node.title });
          this.tooltip.createDiv({ text: hit.node.path });
    this.tooltip.createDiv({ text: `${this.regions.find((r) => r.id === hit.node.region).name} · ${hit.node.degree} 条关联${hit.node.sample ? " · 示例笔记" : ""}` });
          this.tooltip.createDiv({ text: "点击探索关联笔记" });
          this.tooltip.style.left = `${Math.max(8, Math.min(x + 16, rect.width - this.tooltip.offsetWidth - 8))}px`;
          this.tooltip.style.top = `${Math.max(8, Math.min(y + 16, rect.height - this.tooltip.offsetHeight - 8))}px`;
        }
        this.canvas.style.cursor = hit ? "pointer" : "grab";
        if (changed) this.draw();
        return;
      }
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      drag.distance += Math.abs(dx) + Math.abs(dy);
      if (event.shiftKey) { this.panX += dx; this.panY += dy; }
      else { this.yaw += dx * 0.007; this.pitch = Math.max(-1.4, Math.min(1.4, this.pitch + dy * 0.007)); }
      drag.x = event.clientX; drag.y = event.clientY;
      this.draw();
    });
    this.registerDomEvent(this.canvas, "pointerup", (event) => {
      if (drag && drag.distance < 6) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const hit = this.hitTest(x, y);
        this.selected = hit?.node.path || null;
        this.update();
      }
      drag = null;
    });
    this.registerDomEvent(this.canvas, "pointercancel", () => { drag = null; });
    this.registerDomEvent(this.canvas, "pointerleave", () => this.clearHover());
    this.registerDomEvent(this.canvas, "wheel", (event) => {
      event.preventDefault();
      this.clearHover();
      this.zoom = Math.max(0.55, Math.min(2.5, this.zoom * Math.exp(-event.deltaY * 0.001)));
      this.draw();
    }, { passive: false });
    this.registerDomEvent(this.canvas, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Escape"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") this.yaw -= 0.1;
      if (event.key === "ArrowRight") this.yaw += 0.1;
      if (event.key === "ArrowUp") this.pitch = Math.max(-1.4, this.pitch - 0.1);
      if (event.key === "ArrowDown") this.pitch = Math.min(1.4, this.pitch + 0.1);
      if (["+", "="].includes(event.key)) this.zoom = Math.min(2.5, this.zoom + 0.1);
      if (event.key === "-") this.zoom = Math.max(0.55, this.zoom - 0.1);
      if (event.key === "Escape") this.selected = null;
      this.update();
    });
    this.observer = new ResizeObserver(() => this.draw());
    this.observer.observe(this.stage);
    const refresh = () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.refresh(), 150);
    };
    this.registerEvent(this.app.metadataCache.on("resolved", refresh));
    this.registerEvent(this.app.vault.on("rename", refresh));
    this.registerEvent(this.app.vault.on("delete", refresh));
    this.registerEvent(this.app.vault.on("create", refresh));
    this.refresh();
    if (this.compact) {
      this.canvas.setAttribute("tabindex", "-1");
      this.canvas.setAttribute("aria-label", "关联笔记预览。使用“探索知识图谱”进行交互浏览。");
    }
  }
  regionFor(path) {
    if (/^(03 Planning|04 Projects)\//.test(path)) return "direction";
    if (/^(01 Journal|02 Retreats)\//.test(path)) return "memory";
    if (path.startsWith("05 People/")) return "people";
    if (/^(06 Writing|07 Library|09 Reading|wiki|inbox)\//.test(path)) return "knowledge";
    return "practice";
  }
  clearHover() {
    this.hovered = null;
    if (this.tooltip) this.tooltip.hidden = true;
    this.draw();
  }
  hitTest(x, y) {
    const connected = new Set(this.selected ? this.edges.filter(([a, b]) => a === this.selected || b === this.selected).flat() : []);
    return [...this.projected].reverse().filter((p) => this.selected ? p.node.path === this.selected || connected.has(p.node.path) : this.matches(p.node))
      .map((p) => ({ ...p, distance: Math.hypot(p.x - x, p.y - y) }))
      .filter((p) => p.distance < 10).sort((a, b) => a.distance - b.distance || b.depth - a.depth)[0];
  }
  // Low-resolution 3D volume derived from the original folded brain contour.
  // Cached independently of graph hover so labels never rebuild the surface.
  buildBrainGeometry() {
    if (this.brainGeometry) return this.brainGeometry;
    const sample = (d, count, closed = false) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      const length = path.getTotalLength();
      return Array.from({ length: count }, (_, i) => {
        const p = path.getPointAtLength(length * i / (closed ? count : count - 1));
        return [p.x / 180, -p.y / 180];
      });
    };
    const contour = sample("M -8 -151 C -8 -177 -43 -183 -59 -162 C -82 -180 -113 -159 -113 -140 C -140 -143 -159 -122 -155 -99 C -183 -92 -190 -62 -176 -43 C -199 -21 -188 12 -174 22 C -191 46 -176 73 -155 76 C -160 102 -136 123 -115 118 C -103 147 -74 153 -55 137 C -34 155 -8 135 -8 113 Z", 80, true);
    const grooves = ["M -59 -162 C -43 -145 -69 -130 -56 -112 C -46 -98 -22 -115 -8 -99","M -113 -140 C -92 -145 -77 -129 -85 -109 C -96 -89 -118 -111 -126 -91 C -132 -76 -117 -60 -98 -68","M -155 -99 C -137 -93 -151 -63 -135 -48 C -119 -34 -99 -49 -86 -31 C -75 -15 -90 2 -111 -3","M -176 -43 C -159 -50 -141 -28 -150 -10 C -161 7 -151 25 -132 27 C -109 28 -112 51 -93 55","M -174 22 C -160 31 -175 57 -155 76 C -141 87 -125 67 -112 80 C -99 94 -116 106 -115 118","M -8 -61 C -28 -78 -53 -67 -49 -48 C -44 -28 -65 -21 -62 -3 C -59 15 -32 13 -24 31 C -15 46 -31 65 -8 76","M -55 -112 C -77 -97 -61 -77 -73 -63","M -132 27 C -126 6 -142 -8 -128 -24","M -93 55 C -68 40 -53 61 -61 80 C -69 101 -91 99 -83 119 C -78 133 -63 125 -55 137","M -8 113 C -26 100 -27 79 -45 83"].map((d) => sample(d, 28));
    const faces = [], lines = [];
    for (const side of [1, -1]) {
      const rings = [];
      for (let r = 0; r <= 12; r++) {
        const angle = -Math.PI / 2 + r / 12 * Math.PI;
        rings.push(contour.map(([x, y]) => [
          side * (-0.50 + (x + 0.50) * Math.cos(angle)),
          0.03 + (y - 0.03) * Math.cos(angle),
          Math.sin(angle) * 1.05,
        ]));
      }
      for (let r = 0; r < 12; r++) for (let i = 0; i < contour.length; i++) {
        const next = (i+1) % contour.length;
        faces.push([rings[r][i], rings[r][next], rings[r+1][next], rings[r+1][i]]);
      }
      lines.push({ points: [...rings[6], rings[6][0]], alpha: 0.28 });
      for (const zside of [-1, 1]) for (const groove of grooves) {
        lines.push({ points: groove.map(([x, y]) => {
          const angle = Math.atan2(y-0.03, x+0.5);
          const distance = Math.hypot(x+0.5,y-0.03);
          const boundary = contour.reduce((best,p) => {
            const delta = Math.atan2(p[1]-0.03,p[0]+0.5)-angle;
            const error = Math.abs(Math.atan2(Math.sin(delta),Math.cos(delta)));
            return error < best.error ? { error, radius: Math.hypot(p[0]+0.5,p[1]-0.03) } : best;
          }, { error: Infinity, radius: 1 });
          const ratio = Math.min(1, distance / boundary.radius);
          return [x*side,y,zside*1.05*Math.sqrt(1-ratio*ratio)];
        }), alpha: zside === 1 ? 0.23 : 0.09 });
      }
    }
    // Rounded stem, also a volume, not a flat overlay.
    for (let i = 0; i < 16; i++) {
      const a = i/16*Math.PI*2, b = (i+1)/16*Math.PI*2;
      faces.push([[Math.cos(a)*0.10,-0.72,Math.sin(a)*0.10-0.25],
        [Math.cos(b)*0.10,-0.72,Math.sin(b)*0.10-0.25],
        [Math.cos(b)*0.07,-1.12,Math.sin(b)*0.07-0.15],
        [Math.cos(a)*0.07,-1.12,Math.sin(a)*0.07-0.15]]);
    }
    return this.brainGeometry = { faces, lines };
  }
  drawSurface(ctx, width, height) {
    const key = [width,height,this.yaw,this.pitch,this.panX,this.panY,this.zoom,window.devicePixelRatio].join(":");
    if (key !== this.surfaceKey) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = this.surfaceCanvas || (this.surfaceCanvas = document.createElement("canvas"));
      canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
      const layer = canvas.getContext("2d");
      layer.setTransform(dpr,0,0,dpr,0,0);
      const geometry = this.buildBrainGeometry();
      const faces = geometry.faces.map((face) => face.map((p) => this.project(p,width,height)));
      faces.sort((a,b) => a.reduce((s,p)=>s+p.depth,0)-b.reduce((s,p)=>s+p.depth,0));
      layer.fillStyle = "rgba(240,160,135,0.055)";
      for (const face of faces) {
        layer.beginPath(); face.forEach((p,i)=> i ? layer.lineTo(p.x,p.y) : layer.moveTo(p.x,p.y));
        layer.closePath(); layer.fill();
      }
      layer.lineWidth = 1.1; layer.lineJoin = "round"; layer.lineCap = "round";
      for (const line of geometry.lines) {
        layer.beginPath();
        line.points.forEach((v,i) => { const p=this.project(v,width,height); if(i) layer.lineTo(p.x,p.y); else layer.moveTo(p.x,p.y); });
        layer.strokeStyle = `rgba(240,160,145,${line.alpha})`; layer.stroke();
      }
      this.surfaceKey = key;
    }
    ctx.drawImage(this.surfaceCanvas, 0, 0, width, height);
  }
  pointFor(path, region) {
    let hash = 0;
    for (const char of path) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
    const random = () => { hash = (Math.imul(hash, 1664525) + 1013904223) | 0; return (hash >>> 0) / 4294967296; };
    const side = random() < 0.5 ? -1 : 1;
    const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * 0.72;
    let y = Math.sin(angle) * radius, z = Math.cos(angle) * radius;
    if (region === "direction") z = 0.35 + random() * 0.45;
    if (region === "memory") y = 0.2 + random() * 0.55;
    if (region === "people") { y = -0.3 - random() * 0.35; z *= 0.65; }
    if (region === "knowledge") z = -0.3 - random() * 0.5;
    let x = (random() * 2 - 1) * 0.82;
    y = (y - 0.08) / 0.82; z /= 1.12;
    const radius3 = Math.hypot(x, y, z);
    if (radius3 > 0.85) { const factor = 0.85 / radius3; x *= factor; y *= factor; z *= factor; }
    return [side * 0.46 + x * 0.45, 0.08 + y * 0.82, z * 1.12];
  }
  refresh() {
    const all = this.app.vault.getMarkdownFiles().filter((file) =>
      !/^(build|Templates|scripts|Guide|Meta)\//i.test(file.path) && !file.path.startsWith("."));
    const files = all.sort((a, b) => a.path.localeCompare(b.path)).slice(0, this.compact ? 300 : 2000);
    this.total = all.length;
    this.nodes = files.map((file) => {
      const region = this.regionFor(file.path);
      const data = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
      const tags = Array.isArray(data.tags) ? data.tags : String(data.tags || "").split(/[ ,]+/);
      return { path: file.path, title: file.basename || file.path.split("/").pop().replace(/\.md$/, ""), region,
        sample: data.example === true || tags.some((tag) => String(tag).replace(/^#/, "") === "example"),
        point: this.pointFor(file.path, region), degree: 0 };
    });
    const lookup = new Map(this.nodes.map((node) => [node.path, node]));
    const seen = new Set(); this.edges = [];
    for (const [source, targets] of Object.entries(this.app.metadataCache.resolvedLinks || {})) {
      if (!lookup.has(source)) continue;
      for (const target of Object.keys(targets)) {
        if (!lookup.has(target) || source === target) continue;
        const key = JSON.stringify([source, target].sort());
        if (seen.has(key)) continue;
        seen.add(key); this.edges.push([source, target]);
        lookup.get(source).degree++; lookup.get(target).degree++;
      }
    }
    if (!lookup.has(this.selected)) this.selected = null;
    this.update();
  }
  matches(node) { return (this.region === "all" || node.region === this.region) && node.path.toLowerCase().includes(this.query); }
  async openNote(node) {
    const file = this.app.vault.getAbstractFileByPath(node.path);
    if (!(file instanceof TFile)) { new Notice("此笔记已不可用。"); return; }
    const leaf = this.app.workspace.getLeaf("tab"); await leaf.openFile(file); await this.app.workspace.revealLeaf(leaf);
  }
  update() {
    if (!this.panel) return;
    this.hovered = null;
    if (this.tooltip) this.tooltip.hidden = true;
    const visible = this.nodes.filter((node) => this.matches(node));
    const paths = new Set(visible.map((node) => node.path));
    const edgeCount = this.edges.filter(([a, b]) => paths.has(a) && paths.has(b)).length;
    this.summary.setText(`${visible.length} 篇笔记 · ${edgeCount} 条链接 · ${visible.filter((node) => node.sample).length} 篇示例笔记${this.total > this.nodes.length ? ` · 当前显示 ${this.nodes.length}/${this.total} 篇` : ""}`);
    if (this.compact) { this.draw(); return; }
    this.panel.empty();
    const selected = this.nodes.find((node) => node.path === this.selected);
    if (selected) {
      this.panel.createEl("h3", { text: selected.title });
      this.panel.createEl("p", { text: `${selected.path}${selected.sample ? " · 示例笔记" : ""}` });
      const open = this.panel.createEl("button", { text: "打开笔记", cls: "life-os-brain-open" });
      open.addEventListener("click", () => void this.openNote(selected));
    }
    const connected = new Set(this.edges.flatMap(([a, b]) => a === this.selected ? [b] : b === this.selected ? [a] : []));
    const list = selected ? this.nodes.filter((node) => connected.has(node.path)) : visible;
    this.panel.createEl("h3", { text: selected ? `关联笔记（${list.length}）` : `浏览笔记（${visible.length}）` });
    if (!list.length) this.panel.createEl("p", { text: selected ? "暂无关联笔记。可在此笔记中添加双链建立关联。" : "没有匹配的笔记。" });
    for (const node of [...list].sort((a, b) => b.degree - a.degree || a.path.localeCompare(b.path)).slice(0, 60)) {
      const button = this.panel.createEl("button", { cls: "life-os-brain-note", attr: { title: node.path } });
      button.createSpan({ text: node.title });
      button.createEl("small", { text: `${node.degree} 条链接${node.sample ? " · 示例" : ""}` });
      button.addEventListener("click", () => { this.selected = node.path; this.update(); });
    }
    if (list.length > 60) this.panel.createEl("p", { text: "当前显示关联最多的 60 篇笔记。可通过搜索缩小范围。" });
    if (selected) {
      const clear = this.panel.createEl("button", { text: "清除选择" });
      clear.addEventListener("click", () => { this.selected = null; this.update(); });
    }
    this.draw();
  }
  project(point, width, height) {
    const [x, y, z] = point;
    const rx = x * Math.cos(this.yaw) + z * Math.sin(this.yaw);
    const rz = z * Math.cos(this.yaw) - x * Math.sin(this.yaw);
    const ry = y * Math.cos(this.pitch) - rz * Math.sin(this.pitch);
    const depth = y * Math.sin(this.pitch) + rz * Math.cos(this.pitch);
    const scale = Math.min(width, height) * 0.31 * this.zoom * 4.5 / (4.5 - depth);
    return { x: width / 2 + this.panX + rx * scale, y: height / 2 + this.panY - ry * scale, depth, scale };
  }
  draw() {
    const ctx = this.ctx;
    if (!ctx || !this.stage) return;
    const width = this.stage.clientWidth, height = this.stage.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this.canvas.width !== Math.round(width * dpr) || this.canvas.height !== Math.round(height * dpr)) {
      this.canvas.width = Math.round(width * dpr); this.canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    if (!this.compact) {
      const glow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.6);
      glow.addColorStop(0, "#173135"); glow.addColorStop(1, "#0c1118"); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    }
    this.drawSurface(ctx, width, height);
    this.projected = this.nodes.map((node) => ({ ...this.project(node.point, width, height), node })).sort((a, b) => a.depth - b.depth);
    const lookup = new Map(this.projected.map((point) => [point.node.path, point]));
    const focus = this.hovered || this.selected;
    const edges = focus ? this.edges.filter(([a, b]) => a === focus || b === focus) : this.edges;
    const connected = new Set(focus ? edges.flat() : []);
    for (const [a, b] of edges.slice(0, 10000)) {
      const source = lookup.get(a), target = lookup.get(b);
      if (!this.selected && (!this.matches(source.node) || !this.matches(target.node))) continue;
      ctx.beginPath(); ctx.moveTo(source.x, source.y); ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = focus ? "rgba(255,203,159,0.9)" : "rgba(156,193,204,0.15)";
      ctx.lineWidth = focus ? 1.5 : 0.6; ctx.stroke();
    }
    for (const point of this.projected) {
      const active = (focus ? connected.has(point.node.path) || point.node.path === focus : true) && (this.selected || this.matches(point.node)), selected = point.node.path === focus;
      const color = this.regions.find((region) => region.id === point.node.region).color;
      const radius = selected ? 7 : 2.5 + Math.min(3, Math.sqrt(point.node.degree) * 0.5);
      ctx.globalAlpha = active ? Math.max(0.45, 0.7 + point.depth * 0.2) : 0.05;
      ctx.beginPath(); ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.drawLabels(ctx, width, height, focus, connected);
    this.caption.setText(edges.length > 10000 ? "已绘制 10,000 条链接。选择笔记可单独查看它的关联。" : "拖动旋转 · Shift 拖动平移 · 滚轮缩放 · 悬停或点击笔记");
  }
  drawLabels(ctx, width, height, focus, connected) {
    const occupied = [];
    this.visibleLabels = [];
    const candidates = this.projected.filter((p) => (this.selected || this.matches(p.node)) && (!focus || p.node.path === focus || connected.has(p.node.path)))
      .sort((a,b) => Number(b.node.path === focus)-Number(a.node.path === focus) || b.node.degree-a.node.degree || b.depth-a.depth);
    ctx.font = "12px sans-serif";
    for (const p of candidates) {
      if (this.labelMode === "off" && p.node.path !== focus) continue;
      const title = p.node.title.length > 36 ? p.node.title.slice(0,35)+"…" : p.node.title;
      const w = ctx.measureText(title).width + 8;
      const box = { x: p.x+9, y: p.y-17, w, h: 18 };
      if (box.x < 0 || box.y < 0 || box.x+w > width || box.y+18 > height-35) continue;
      if (this.labelMode === "auto" && occupied.some((r) => box.x < r.x+r.w && box.x+w > r.x && box.y < r.y+r.h && box.y+18 > r.y)) continue;
      occupied.push(box); this.visibleLabels.push(p.node.path);
      ctx.fillStyle = "rgba(12,17,24,0.78)"; ctx.fillRect(box.x,box.y,w,18);
      ctx.fillStyle = p.node.path === focus ? "#fff1e4" : "#bac9d0";
      ctx.fillText(title,box.x+4,box.y+13);
    }
  }
  async onClose() {
    clearTimeout(this.timer); this.observer?.disconnect(); this.contentEl.empty(); this.ctx = null; this.panel = null; this.surfaceCanvas = null; this.brainGeometry = null;
  }
  onload() { void this.onOpen(); }
  onunload() { void this.onClose(); }
}

// Retain compatibility with already-open standalone Brain tabs.
class LifeOSBrainView extends ItemView {
  async onOpen() {
    this.renderer = new LifeOSBrainRenderer(this.app, this.contentEl);
    this.addChild(this.renderer);
  }
  getViewType() { return "life-os-brain"; }
  getDisplayText() { return "Life OS 知识图谱"; }
  getIcon() { return "brain"; }
  async onClose() { if (this.renderer) this.removeChild(this.renderer); this.renderer = null; }
}

module.exports = class LifeOSPlugin extends Plugin {
  async onload() {
    this.registerView("life-os-brain", (leaf) => new LifeOSBrainView(leaf));
    this.registerView(
      VIEW_TYPE,
      (leaf) => new LifeOSHomeView(leaf, this)
    );

    this.addRibbonIcon("compass", "打开 Life OS", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-home",
      name: "打开 Life OS 首页",
      callback: () => this.activateView("home"),
    });

    this.addCommand({
      id: "open-capture",
      name: "打开 Life OS 快速记录",
      callback: () => this.openCapture(),
    });

    this.addCommand({
      id: "open-configuration",
      name: "打开 Life OS 配置",
      callback: () => this.app.workspace.openLinkText("Meta/Compass Config", "", true),
    });

    for (const item of NAV_ITEMS.filter((item) => item.id !== "home")) {
      this.addCommand({
        id: `open-${item.id}`,
        name: `打开 Life OS：${item.label}`,
        callback: () => this.activateView(item.id),
      });
    }

    this.app.workspace.onLayoutReady(() => {
      void this.activateView();
    });
  }

  async activateView(screen = "home") {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];

    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({
        type: VIEW_TYPE,
        active: true,
      });
    }

    if (leaf.view instanceof LifeOSHomeView) {
      leaf.view.activeScreen = screen;
      leaf.view.render();
    }

    await this.app.workspace.revealLeaf(leaf);
  }

  openCapture() {
    new LifeOSCaptureModal(this.app, this).open();
  }

  runCommand(commandId, label) {
    const ran = this.app.commands.executeCommandById(commandId);

    if (!ran) {
      new Notice(
        `${label} 暂不可用。请检查所需插件是否已启用。`
      );
    }

    return ran;
  }

  onunload() {
    this.app.workspace.detachLeavesOfType("life-os-brain");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }
};
