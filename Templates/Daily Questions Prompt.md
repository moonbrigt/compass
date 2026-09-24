<%*
/*
  Compass：晚间每日问题提示词（Marshall Goldsmith，《Triggers》）。
  在日记中运行此模板（Templater：插入模板，或使用自己设置的快捷键）。
  它逐项询问 1 到 10 分的每日问题，再询问每个 habit_* 属性是否完成，
  然后将答案写入笔记属性；不会向正文插入内容。
  问题来自 Meta/Compass Config.md 的 `questions` 列表；仅在缺少该列表时使用下方 FALLBACK。
  以“今天我是否尽力……”为框架，评价努力程度，而非结果。
*/
const FALLBACK = [
  ["dq_goals",         "今天我是否尽力设定了清晰的目标？"],
  ["dq_progress",      "今天我是否尽力朝目标前进？"],
  ["dq_meaning",       "今天我是否尽力寻找意义？"],
  ["dq_happy",         "今天我是否尽力让自己快乐？"],
  ["dq_relationships", "今天我是否尽力建立积极的人际关系？"],
  ["dq_engaged",       "今天我是否尽力全心投入？"],
];
const file = tp.config.target_file;
const cache = app.metadataCache.getFileCache(file) || {};
const fm = cache.frontmatter || {};
const cfg = app.metadataCache.getFileCache(app.vault.getAbstractFileByPath("Meta/Compass Config.md"))?.frontmatter || {};
const HB = cfg.habit_prefix || "habit_";
const QUESTIONS = Array.isArray(cfg.questions) && cfg.questions.length ? cfg.questions.map(q => typeof q === "string" ? [q, "今天我是否尽力做到" + q.replace(/^dq_/, "").replace(/[_-]+/g, " ") + "？"] : [q.key, q.text]).filter(x => x[0] && x[1]) : FALLBACK;
const answers = {};
let cancelled = false;
for (const [key, q] of QUESTIONS) {
  const a = await tp.system.prompt(`${q}（1 = 完全没有尽力，10 = 已经尽最大努力）`, fm[key] ? String(fm[key]) : "");
  if (a === null) { cancelled = true; break; }
  const n = parseInt(a);
  if (!isNaN(n)) answers[key] = Math.min(10, Math.max(1, n));
}
if (!cancelled) {
  const habits = Object.keys(fm).filter(k => k.startsWith(HB));
  for (const h of habits) {
    const nice = ({ habit_journal: "日记", habit_exercise: "运动", habit_reading: "阅读" })[h] || h.slice(HB.length).replace(/[_-]+/g, " ");
    const pick = await tp.system.suggester(["是", "否"], [true, false], false, `习惯：${nice}？`);
    if (pick === null) break;
    answers[h] = pick;
  }
}
if (Object.keys(answers).length) {
  await app.fileManager.processFrontMatter(file, f => { Object.assign(f, answers); });
  new Notice(`已将 ${Object.keys(answers).length} 项答案保存到 ${file.basename}`);
}
-%>
