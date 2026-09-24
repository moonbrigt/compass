// Compass 生活之轮组件：由 wheel_* 数值属性绘制雷达图。
// Usage:
//   await dv.view("元数据/视图/wheel")                                  -> this quarter's retreat (by naming convention), else most recent
//   await dv.view("元数据/视图/wheel", { page: dv.current().file.path })  -> a specific retreat note (used inside the retreat template)
const cfg = dv.page("元数据/Compass Config") || {};
const FOLDER = cfg.retreat_folder || "02 静修";
const PREFIX = cfg.wheel_prefix || "wheel_";

let page = input && input.page ? dv.page(input.page) : null;
let how = "";
if (!page) {
  const q = moment().quarter(), yr = moment().year();
  page = dv.page(`${FOLDER}/${yr}-Q${q} Personal Retreat`);
  how = page ? `本季度（${yr}-Q${q}）` : "";
}
if (!page) {
  const all = dv.pages(`"${FOLDER}"`).where(p => /^\d{4}-Q[1-4] Personal Retreat$/.test(p.file.name)).sort(p => p.file.name, "desc").array();
  page = all[0];
  how = page ? "最近一次个人静修" : "";
}

const root = dv.container.createEl("div", { cls: "lifeos-widget" });
if (!page) {
  root.createEl("p", { text: `在 ${FOLDER} 中找不到个人静修笔记。请创建名为“YYYY-QN Personal Retreat”的笔记（例如 ${moment().year()}-Q${moment().quarter()} Personal Retreat），并填写 ${PREFIX}* 属性。` });
} else {
  const fm = page.file.frontmatter || {};
  const axes = Object.keys(fm)
    .filter(k => k.startsWith(PREFIX) && fm[k] !== null && fm[k] !== "" && !isNaN(Number(fm[k])))
    .map(k => ({ key: k, name: ({ wheel_health: "健康", wheel_relationships: "人际关系", wheel_family: "家庭", wheel_career: "事业", wheel_finances: "财务", wheel_growth: "成长", wheel_fun: "乐趣", wheel_meaning: "意义" })[k] || k.slice(PREFIX.length).replace(/[_-]+/g, " "), v: Math.max(0, Math.min(10, Number(fm[k]))) }));
  if (how) root.createEl("p", { text: `数据来源：${page.file.name}（${how}）` }).style.opacity = "0.7";
  if (axes.length < 3) {
    root.createEl("p", { text: `静修笔记 ${page.file.name} 填写的 ${PREFIX}* 属性少于 3 项。` });
  } else {
    const n = axes.length, cx = 170, cy = 160, R = 105, W = 340, H = 320;
    const ang = i => -Math.PI / 2 + i * 2 * Math.PI / n;
    const pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:${W}px">`;
    for (const ring of [2, 4, 6, 8, 10]) {
      const pts = axes.map((_, i) => pt(i, R * ring / 10).map(c => c.toFixed(1)).join(",")).join(" ");
      svg += `<polygon points="${pts}" fill="none" stroke="currentColor" stroke-opacity="${ring === 10 ? 0.4 : 0.15}" />`;
    }
    axes.forEach((a, i) => {
      const [x2, y2] = pt(i, R);
      svg += `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-opacity="0.2" />`;
      const [lx, ly] = pt(i, R + 22);
      const anchor = Math.abs(lx - cx) < 5 ? "middle" : (lx > cx ? "start" : "end");
      svg += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-size="11" text-anchor="${anchor}" fill="currentColor">${a.name} (${a.v})</text>`;
    });
    const poly = axes.map((a, i) => pt(i, R * a.v / 10).map(c => c.toFixed(1)).join(",")).join(" ");
    svg += `<polygon points="${poly}" fill="var(--interactive-accent)" fill-opacity="0.35" stroke="var(--interactive-accent)" stroke-width="2" />`;
    axes.forEach((a, i) => { const [px, py] = pt(i, R * a.v / 10); svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="var(--interactive-accent)" />`; });
    svg += `</svg>`;
    root.createEl("div", { cls: "lifeos-chart" }).innerHTML = svg;
    const avg = axes.reduce((s, a) => s + a.v, 0) / n;
    const low = [...axes].sort((a, b) => a.v - b.v)[0];
    root.createEl("p", { text: `平均值 ${avg.toFixed(1)}/10。最低的领域是${low.name}（${low.v} 分），可以作为未来 90 天的关注候选。` });
  }
}
