“今天我是否尽力……”以 1 到 10 分评价，来自 Marshall Goldsmith 的《Triggers》。评价的是努力程度，而非结果：生病时慢跑 3 英里可以是 10 分；只因不想跑，就把计划的 12 英里缩短到 6 英里，可能只有 5 分。

每日问题存储在日记的 `dq_*` 数值属性中。可在 [[Compass Config|Compass 配置]] 中编辑 `questions` 列表；新日记和晚间提示词会使用更新后的列表。

## 趋势
```dataviewjs
await dv.view("元数据/视图/dailyquestions", { days: 90 });
```

## 已填写日期
```dataviewjs
const cfg = dv.page("元数据/Compass Config") || {};
const folder = cfg.daily_folder || "01 日记/每日", pre = cfg.dq_prefix || "dq_";
const pages = dv.pages(`"${folder}"`).where(p => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name)).sort(p => p.file.name, "desc").array();
const keys = [...new Set(pages.flatMap(p => Object.keys(p.file.frontmatter || {}).filter(k => k.startsWith(pre))))].sort();
const labels = { dq_goals: "目标", dq_progress: "进展", dq_meaning: "意义", dq_happy: "快乐", dq_relationships: "积极关系", dq_engaged: "全心投入" };
const label = k => labels[k] || k.slice(pre.length).replace(/[_-]+/g, " ");
const val = (p, k) => { const v = (p.file.frontmatter || {})[k]; return v === null || v === undefined || v === "" ? "" : String(v); };
const rows = pages.filter(p => keys.some(k => val(p, k) !== "")).slice(0, 30).map(p => [p.file.link, ...keys.map(k => val(p, k))]);
if (keys.length) dv.table(["日期", ...keys.map(label)], rows); else dv.paragraph(`尚未找到 ${pre}* 属性。`);
```

## 询问助手
```agent
type: button
text: "分析每日问题与习惯趋势"
prompt: "请用 vault_read 阅读 提示词/13 Trend Analysis.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
