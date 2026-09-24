// Compass 设置状态组件：检查哪些项目仍是模板默认状态。
// 只显示是否完成，不展示密钥值，也不写入文件。
const cfg = dv.page("元数据/Compass Config") || {};
const cur = dv.current() || {};
const rows = [];
const add = (tier, item, ok, where, note) => rows.push({ tier, item, ok, where, note: note || "" });
const readJson = async p => { try { return JSON.parse(await app.vault.adapter.read(p)); } catch (e) { return null; } };
const readText = async p => { try { const f = app.vault.getAbstractFileByPath(p); return f ? await app.vault.cachedRead(f) : ""; } catch (e) { return ""; } };
const enabled = id => { try { return app.plugins.enabledPlugins.has(id); } catch (e) { return false; } };
const pset = id => { try { return app.plugins.plugins[id]?.settings || null; } catch (e) { return null; } };
const today = moment();

// 第 0 层：应用
for (const [id, name] of [["life-os-app", "Life OS"], ["dataview", "Dataview"], ["templater-obsidian", "Templater"], ["periodic-notes", "Periodic Notes"], ["quickadd", "QuickAdd"], ["obsidian-tasks-plugin", "Tasks"], ["obsidian-kanban", "Kanban"]])
  add(0, `${name} 插件已启用`, enabled(id), "设置 → 第三方插件");
add(0, "Life OS 应用命令已注册", !!app.commands?.commands?.["life-os-app:open-home"], "命令面板 → Life OS：打开 Life OS 首页");
add(0, "Dataview JavaScript 查询已启用", !!(pset("dataview")?.enableDataviewJs), "设置 → Dataview");
add(0, "lifeos CSS 样式代码片段已启用", (() => { try { return app.customCss.enabledSnippets.has("lifeos"); } catch (e) { return false; } })(), "设置 → 外观 → CSS 样式代码片段");
add(0, "Periodic Notes 的日记文件夹与配置一致", (() => { const pn = pset("periodic-notes"); return !!pn && pn.daily?.folder === (cfg.daily_folder || "01 日记/每日") && /Daily Note\.md$/.test(pn.daily?.template || ""); })(), "设置 → Periodic Notes");
add(0, "Templater 会在新建文件时运行", (() => { const t = pset("templater-obsidian"); return !!t && (t.trigger_on_file_creation === true || t.trigger_on_file_creation_mode === "folder"); })(), "设置 → Templater");
add(0, "QuickAdd 记录选项可作为命令运行", (() => { const ch = pset("quickadd")?.choices || []; return ["lifeos-journal", "lifeos-win", "lifeos-gratitude", "lifeos-task"].every(id => ch.find(c => c.id === id)?.command === true); })(), "设置 → QuickAdd（每个选项旁的闪电图标）");
add(0, "今日笔记和每日问题提示词已设置快捷键", (() => { try { const hk = app.hotkeyManager.customKeys || {}; return ["quickadd:choice:lifeos-daily", "templater-obsidian:模板/Daily Questions Prompt.md"].every(id => (hk[id] || []).length > 0); } catch (e) { return false; } })(), "设置 → 快捷键");

// 第 1 层：个性化配置
add(1, "已设置出生日期", !!cfg.birthdate && String(cfg.birthdate).slice(0, 10) !== "1990-01-01", "[[Compass Config]]");
const theme = await readText("03 规划/Life Theme.md");
add(1, "已填写生活主题", theme.length > 0 && !theme.includes("请在此写下你的生活主题"), "[[Life Theme]]");
const values = await readText("03 规划/Core Values.md");
add(1, "已填写核心价值观", values.length > 0 && !/\*\*价值一\*\*/.test(values), "[[Core Values]]");
add(1, "已将理想一周改为自己的安排（移除示例属性）", !((dv.page("03 规划/Ideal Week") || {}).example === true), "[[Ideal Week]]", "填写表格后删除 example 属性");
add(1, "已检查每日问题、习惯和生活领域", Array.isArray(cfg.questions) && cfg.questions.length > 0 && Array.isArray(cfg.habits) && cfg.habits.length <= 5, "[[Compass Config]]", Array.isArray(cfg.habits) && cfg.habits.length > 5 ? "习惯超过 5 项；建议每阶段保持 3 到 5 项" : "");
const examples = dv.pages("#example").length;
add(1, "已删除示例笔记", examples === 0, "[[16 Onboarding Assistant]] 第 6 步，或删除带 example 标签的笔记", examples ? `还剩 ${examples} 篇示例笔记` : "");

// 第 2 层：日常实践
const daily = cfg.daily_folder || "01 日记/每日";
const dqp = cfg.dq_prefix || "dq_";
add(2, "今日笔记已创建", !!dv.page(`${daily}/${today.format("YYYY-MM-DD")}`), "Ctrl/Cmd+Shift+D");
const real = dv.pages(`"${daily}"`).where(p => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name) && !(p.tags || []).includes("example")).array();
const answered = real.filter(p => Object.entries(p.file.frontmatter || {}).some(([k, v]) => k.startsWith(dqp) && v !== null && v !== "" && v !== undefined));
const last30 = answered.filter(p => today.diff(moment(p.file.name), "days") < 30).length;
add(2, "已回答至少一次真实的每日问题", answered.length > 0, "今晚按 Ctrl/Cmd+Shift+Q，或使用 [[02 End of Day Coaching]]");
add(2, "近 30 天填写天数（目标 25 天）", last30 >= 25, "继续保持", `${last30}/30`);
add(2, "本周笔记已创建", !!dv.page(`${cfg.weekly_folder || "01 日记/每周"}/${today.format("gggg-[W]ww")}`), "命令面板：Periodic Notes: Open weekly note", "从第 2 周开始");
const retreat = dv.page(`${cfg.retreat_folder || "02 静修"}/${today.format("YYYY-[Q]Q")} Personal Retreat`);
add(2, "本季度个人静修笔记已创建", !!retreat && !(retreat.tags || []).includes("example"), "[[04 Workflow - Personal Retreat]]", "从第 60 天开始");
const plan = (await readText("09 阅读/Reading Plan.md")).replace(/```[\s\S]*?```/g, "");
if (app.vault.getAbstractFileByPath("09 阅读")) add(2, "已决定是否使用阅读模块（填写计划或删除文件夹）", /^- \[ \]/m.test(plan), "[[07 Workflow - Daily Reading]]", "可选");

// 第 3 层：仓库内 AI（可选）
add(3, "Agent Client 插件已启用", enabled("agent-client"), "设置 → 第三方插件", "可选");
const ac = await readJson(".obsidian/plugins/agent-client/data.json");
const configuredCommands = Object.values(ac?.presetAgents || {}).map(p => p?.command || "").filter(Boolean);
const isLinux = navigator.userAgent.includes("Linux") && !navigator.userAgent.includes("Android");
add(3, "Agent Client 中已设置至少一个本地代理路径", configuredCommands.some(cmd => !isLinux || cmd.startsWith("/")), "设置 → Agent Client → 选择代理 → 自动检测", "可选；Linux Flatpak 需填写包装脚本的完整路径，参见指南 14");
add(3, "代理已登录（手动确认）", cur.setup_claude_login === true, "在本笔记属性中勾选 setup_claude_login", "可选；为兼容升级而保留原属性名");
add(3, "已为代理注册 Obsidian MCP 服务器（手动确认）", cur.setup_mcp_registered === true, "阅读 [[19 Obsidian MCP Bridge]]，再勾选 setup_mcp_registered", "可选");
add(3, "Agent Client 已进行过对话", (ac?.savedSessions || []).length > 0, "[[Assistant]]", "可选");

// 第 4 层：浏览器与网页（可选）
add(4, "Local REST API 已启用", enabled("obsidian-local-rest-api"), "设置 → 第三方插件", "可选");
const ra = await readJson(".obsidian/plugins/obsidian-local-rest-api/data.json");
add(4, "已生成 REST API 密钥（此处不显示）", typeof ra?.apiKey === "string" && ra.apiKey.length > 0 && ra?.enableInsecureServer === true, "设置 → Local REST API", "可选");
add(4, "Vault Lens 扩展已连接（手动确认）", cur.setup_vault_lens === true, "阅读 [[17 Search Providers]]，再勾选 setup_vault_lens", "可选");
add(4, "Web viewer 核心插件已启用", (() => { try { return app.internalPlugins.plugins.webviewer?.enabled === true; } catch (e) { return false; } })(), "设置 → 核心插件", "可选");
add(4, "已设置 SEO 扫描目录", ((await readJson(".obsidian/plugins/seo/data.json"))?.scanDirectories || "").includes("06 写作"), "设置 → SEO", "可选");
add(4, "仓库文件夹已有备份（手动确认）", cur.setup_backup === true, "将文件夹复制到其他位置，再勾选 setup_backup");

// 渲染设置清单
const root = dv.container.createEl("div", { cls: "lifeos-widget" });
if (cur.status === "done") { root.createEl("p", { text: "设置清单已标记为完成。修改本笔记的 status 属性可重新打开清单。" }); }
else {
  const tiers = { 0: "第 0 层：应用", 1: "第 1 层：个性化配置", 2: "第 2 层：日常实践", 3: "第 3 层：仓库内 AI（可选）", 4: "第 4 层：浏览器与网页（可选）" };
  const total = rows.filter(r => r.tier <= 2).length, done = rows.filter(r => r.tier <= 2 && r.ok).length;
  root.createEl("p", { text: `必需项目已完成 ${done}/${total} 项。下方项目为可选功能，不配置也能使用仓库。` });
  for (const t of [0, 1, 2, 3, 4]) {
    root.createEl("h4", { text: tiers[t] });
    const table = root.createEl("table", { cls: "lifeos-table" });
    const th = table.createEl("thead").createEl("tr"); for (const h of ["", "项目", "设置位置", "说明"]) th.createEl("th", { text: h });
    const tb = table.createEl("tbody");
    for (const r of rows.filter(x => x.tier === t)) {
      const tr = tb.createEl("tr");
      tr.createEl("td", { text: r.ok ? "✅" : "⬜" });
      tr.createEl("td", { text: r.item });
      const td = tr.createEl("td");
      const m = r.where.match(/^\[\[([^\]]+)\]\]/);
      if (m) { const a = td.createEl("a", { text: m[1], cls: "internal-link", attr: { href: m[1], "data-href": m[1] } }); a.addEventListener("click", e => { e.preventDefault(); app.workspace.openLinkText(m[1], "", false); }); td.appendText(r.where.slice(m[0].length)); }
      else td.setText(r.where);
      tr.createEl("td", { text: r.note });
    }
  }
}
