// Compass 快捷链接：QuickAdd 记录按钮与多时间跨度计划笔记入口。
// Usage: await dv.view("元数据/视图/quicklinks")
const cfg = dv.page("元数据/Compass 配置") || {};
const DAILY = cfg.daily_folder || "01 日记/每日";
const WEEKLY = cfg.weekly_folder || "01 日记/每周";
const QUARTERLY = cfg.quarterly_folder || "01 日记/季度";
const RETREATS = cfg.retreat_folder || "02 静修";
const root = dv.container.createEl("div", { cls: "lifeos-widget" });

const now = moment();
const links = [
  ["今日", `${DAILY}/${now.format("YYYY-MM-DD")}`, now.format("YYYY-MM-DD")],
  ["本周", `${WEEKLY}/${now.format("gggg-[W]ww")}`, now.format("gggg-[W]ww")],
  ["本季度", `${QUARTERLY}/${now.format("YYYY-[Q]Q")}`, now.format("YYYY-[Q]Q")],
  ["个人静修", `${RETREATS}/${now.format("YYYY-[Q]Q")} 个人静修`, `${now.format("YYYY-[Q]Q")} 个人静修`],
];
const p = root.createEl("p");
p.appendText("快速跳转：");
links.forEach(([lab, path, name], i) => {
  if (i) p.appendText("  ·  ");
  const a = p.createEl("a", { text: `${lab} (${name})`, cls: "internal-link", attr: { href: name, "data-href": name } });
  a.addEventListener("click", e => { e.preventDefault(); app.workspace.openLinkText(name, path, false); });
});

// QuickAdd 选项由稳定 ID 定位，显示名称可独立汉化。
const buttons = [
  ["📝 记录日记", "lifeos-journal"],
  ["🏆 记录一件好事", "lifeos-win"],
  ["🙏 记录感恩", "lifeos-gratitude"],
  ["✅ 添加任务", "lifeos-task"],
];
const wrap = root.createEl("div", { cls: "lifeos-buttons" });
for (const [lab, choiceId] of buttons) {
  const b = wrap.createEl("button", { text: lab });
  b.addEventListener("click", () => {
    const ok = app.commands.executeCommandById(`quickadd:choice:${choiceId}`);
    if (!ok) new Notice(`${lab} 暂不可用。请检查 QuickAdd 设置中的命令开关。`);
  });
}
