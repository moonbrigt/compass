---
cssclasses:
  - lifeos-dashboard
---
下方内容由已有笔记生成。修改日记模板、个人静修笔记或配置后，本页会随之更新，无需编辑代码。

```dataviewjs
await dv.view("元数据/视图/quicklinks");
```

> [!theme] 生活主题
> ![[Life Theme#主题]]

## 生活之轮（本季度个人静修）
```dataviewjs
await dv.view("元数据/视图/wheel");
```

## 每日问题
显示日记中每项 `dq_*` 属性的曲线和平均值。可切换问题并选择时间范围。
```dataviewjs
await dv.view("元数据/视图/dailyquestions", { days: 30 });
```

## 习惯
```dataviewjs
await dv.view("元数据/视图/habits", { days: 21 });
```

## 看板
```dataviewjs
await dv.view("元数据/视图/boards", { compact: true });
```

## 人生时间
```dataviewjs
await dv.view("元数据/视图/memento");
```

## 询问助手
打开 [[Assistant|助手仪表盘]] 查看完整提示词库，或使用以下入口（需要 Agent Client 插件和已配置的代理）：
```agent
type: button
text: "今日要事"
prompt: "请用 vault_read 阅读 提示词/14 What Matters Today.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
```agent
type: button
text: "复盘本周"
prompt: "请用 vault_read 阅读 提示词/03 Weekly Review.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 相关仪表盘
- [[Habit Canvas|习惯画布]]
- [[Daily Questions|每日问题]]
- [[Task Dashboard|任务仪表盘]]
- [[Projects Dashboard|项目仪表盘]]
- [[Boards|看板总览]]
- [[Assistant|助手仪表盘]]
- [[Setup|设置]]
- [[Ideal Week|理想的一周]] · [[Core Values|核心价值观]] · [[Life Theme|人生主题]]
