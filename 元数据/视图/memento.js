// Compass 人生时间组件：从 元数据/Compass 配置 读取 birthdate 与 life_expectancy。
const cfg = dv.page("元数据/Compass 配置") || {};
const root = dv.container.createEl("div", { cls: "lifeos-widget" });
if (!cfg.birthdate) {
  root.createEl("p", { text: "请在 元数据/Compass 配置 中设置 `birthdate`（YYYY-MM-DD）和 `life_expectancy`，以启用人生时间组件。" });
} else {
  const birth = moment(String(cfg.birthdate).slice(0, 10));
  const years = Number(cfg.life_expectancy) || 80;
  const today = moment().startOf("day");
  const weeksLived = today.diff(birth, "weeks");
  const totalWeeks = Math.round(years * 52.1775);
  const weeksLeft = Math.max(0, totalWeeks - weeksLived);
  const pct = Math.min(100, Math.round(1000 * weeksLived / totalWeeks) / 10);
  const age = today.diff(birth, "years");
  root.createEl("p", { text: `你现在 ${age} 岁，已经度过约 ${weeksLived.toLocaleString("zh-CN")} 周。如果活到 ${years} 岁，预计还剩约 ${weeksLeft.toLocaleString("zh-CN")} 周（已度过 ${pct}%）。` });
  const bar = root.createEl("div", { cls: "lifeos-bar" });
  bar.createEl("div").style.width = pct + "%";
  const grid = root.createEl("div", { cls: "lifeos-years" });
  grid.style.marginTop = "0.5em";
  for (let y = 0; y < years; y++) {
    const s = grid.createEl("span");
    if (y < age) s.addClass("lived");
    if (y === age) s.addClass("now");
    s.title = `${y} 岁`;
  }
  root.createEl("p", { text: "每个方格代表一年。认真安排接下来的一年。" }).style.opacity = "0.6";
}
