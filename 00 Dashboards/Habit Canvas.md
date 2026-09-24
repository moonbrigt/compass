习惯通过日记中的 `habit_*` 复选属性记录。不需要额外应用或提醒，也不用因为连续记录中断而自责。本页只将已有数据可视化；习惯记录旁的日记可帮助你理解那天发生了什么。

## 近 8 周
```dataviewjs
await dv.view("Meta/views/habits", { days: 56 });
```

## 近 2 周
```dataviewjs
await dv.view("Meta/views/habits", { days: 14 });
```

## 调整追踪的习惯
1. 打开 [[Compass Config|Compass 配置]]。
2. 在 `habits` 列表中添加或删除条目，保留 `habit_` 前缀。
3. 新建的日记会带上更新后的复选属性，本仪表盘也会自动识别。

每个阶段保持少量习惯（3 到 5 项）。如实记录比追求完美更有用。

## 询问助手
```agent
type: button
text: "分析每日问题与习惯趋势"
prompt: "请用 vault_read 阅读 Prompts/13 Trend Analysis.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
