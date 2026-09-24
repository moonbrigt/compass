---
date: <% tp.date.now("YYYY-MM-DD") %>
quarter: <% tp.file.title.slice(0, 7) %>
tags:
  - retreat
<%* const _cf = app.vault.getAbstractFileByPath("元数据/Compass Config.md"); const _cfg = _cf ? (app.metadataCache.getFileCache(_cf)?.frontmatter ?? {}) : {}; const _ws = Array.isArray(_cfg.wheel_areas) && _cfg.wheel_areas.length ? _cfg.wheel_areas : ["wheel_health","wheel_relationships","wheel_family","wheel_career","wheel_finances","wheel_growth","wheel_fun","wheel_meaning"]; tR += _ws.map(k => k + ": ").join("\n"); %>
---
> 请将本笔记命名为 `YYYY-QN Personal Retreat`，例如 `2026-Q3 Personal Retreat`。Compass 仪表盘会按这个命名规则找到本季度的静修笔记，并使用上方的 `wheel_*` 属性绘制生活之轮；无需修改代码。

上次静修：[[02 静修/<% moment(tp.file.title.slice(0, 7), "YYYY-[Q]Q").subtract(1, "quarter").format("YYYY-[Q]Q") %> Personal Retreat|上季度个人静修]] · 季度笔记：[[01 日记/季度/<% tp.file.title.slice(0, 7) %>|本季度笔记]] · 去年同期：[[02 静修/<% moment(tp.file.title.slice(0, 7), "YYYY-[Q]Q").subtract(1, "year").format("YYYY-[Q]Q") %> Personal Retreat|去年同期个人静修]]

尽量留出一整天。无需远行；有几个小时、这篇笔记，以及认真回答困难问题的意愿，就能开始。

```agent
type: button
text: "准备个人静修"
prompt: "请用 vault_read 阅读 提示词/04 Retreat Prep.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
```agent
type: button
text: "引导本次个人静修"
prompt: "请用 vault_read 阅读 提示词/05 Retreat Facilitation.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 1. 回顾生活主题与核心价值观
它们仍然符合现在的你吗？如果不符合，请修改原始笔记。
![[Life Theme#主题]]
![[Core Values#价值观]]

笔记：
- 

## 2. 回顾日记
阅读最近 90 天的日记，观察努力程度评分的趋势，以及反复出现的主题。
```dataviewjs
const q = moment(dv.current().quarter, "YYYY-[Q]Q");
await dv.view("元数据/视图/dailyquestions", { from: q.clone().startOf("quarter").format("YYYY-MM-DD"), to: q.clone().endOf("quarter").format("YYYY-MM-DD") });
```
```dataviewjs
await dv.view("元数据/视图/habits", { days: 28 });
```
本季度的收获：
```dataviewjs
const q = moment(dv.current().quarter, "YYYY-[Q]Q");
const from = q.clone().startOf("quarter"), to = q.clone().endOf("quarter");
const cfg = dv.page("元数据/Compass Config") || {};
const pages = dv.pages(`"${cfg.daily_folder || "01 日记/每日"}"`).where(p => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name) && moment(p.file.name).isBetween(from, to, "day", "[]")).sort(p => p.file.name);
const wins = [];
for (const p of pages) for (const L of p.file.lists) if (L.section && L.section.subpath === "收获") wins.push(`${p.file.link}: ${L.text}`);
if (wins.length) dv.list(wins); else dv.paragraph("*本季度尚未记录收获。*");
```
有哪些事特别值得注意：
- 

## 3. 生活之轮
在上方属性中，用 1 到 10 分评价各生活领域的当前状态。然后只选一个未来 90 天要重点关注的领域。
```dataviewjs
await dv.view("元数据/视图/wheel", { page: dv.current().file.path });
```
未来 90 天的关注领域：
- 

为什么选择它：
- 

## 4. 回顾
### 第一部分：回看上季度
将上季度的静修笔记与本篇并排打开。原定计划实现了吗？你确实在改变，还是只换了一种说法重复同样的目标？

做得好的事：
- 

不顺利的事：
- 

学到的事：
- 

### 第二部分：开始／停止／保持
| 开始 | 停止 | 保持 |
| --- | --- | --- |
|  |  |  |

## 5. 下季度意向
最多三项。每项都应能落实为每周行动。
1. 
2. 
3. 

## 6. 检查理想一周
[[Ideal Week|理想的一周]] 是否为上述意向留出了时间？现在就调整。
![[Ideal Week#时间表]]

需要调整的地方：
- 

## 7. 本季度要投入的项目
在 `04 项目/` 中创建或更新项目笔记，并将 `quarter:` 设为本季度，使它们出现在季度笔记中。
- 

## 结语
用一句话概括本季度方向：
- 
