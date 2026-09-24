# Compass 仪表盘

视频：18:36–20:46。页面上的组件由 DataviewJS 读取笔记属性动态生成。

## 组件及数据来源

| 组件 | 视图 | 读取内容 |
| --- | --- | --- |
| 当季生命之轮 | `Meta/views/wheel.js` | 按当前日期查找 `02 Retreats/YYYY-QN Personal Retreat.md` 中的 `wheel_*` 分数 |
| 每日问题趋势 | `Meta/views/dailyquestions.js` | 各日记的 `dq_*` 数字属性 |
| 习惯统计 | `Meta/views/habits.js` | 各日记的 `habit_*` 复选框 |
| 人生主题 | 嵌入笔记 | `03 Planning/Life Theme.md#主题` |
| 生命倒计时 | `Meta/views/memento.js` | `Meta/Compass Config.md` 中的 `birthdate`、`life_expectancy` |
| 快捷入口 | `Meta/views/quicklinks.js` | QuickAdd 固定命令 ID、今日日期 |

另有 `Projects Dashboard.md`、`Daily Questions.md`、`Habit Canvas.md`、`Task Dashboard.md` 等专页。

## 在其他笔记复用视图

```dataviewjs
await dv.view("Meta/views/habits", { days: 28 });
await dv.view("Meta/views/dailyquestions", { from: "2026-07-01", to: "2026-09-30" });
await dv.view("Meta/views/wheel", { page: "02 Retreats/2026-Q2 Personal Retreat" });
await dv.view("Meta/views/week", { week: "2026-W35" });
```

`Meta/Compass Config.md` 保存文件夹、属性前缀、出生日期与预期寿命；若缺少配置，视图会使用默认值。新增组件时可参考 `Meta/views/habits.js` 的配置读取、收集和渲染方式，再以 `dv.view` 调用。各 DataviewJS 视图不能直接互相导入，因此文件各自独立。
