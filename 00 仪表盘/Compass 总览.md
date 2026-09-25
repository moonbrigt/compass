---
cssclasses:
  - lifeos-dashboard
---
下方内容由已有笔记生成。修改日记模板、个人静修笔记或配置后，本页会随之更新，无需编辑代码。

```dataviewjs
await dv.view("元数据/视图/quicklinks");
```

> [!theme] 生活主题
> ![[人生主题#主题]]

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
打开 [[智能助手|助手仪表盘]] 查看完整提示词库，或使用以下入口（需要 Agent Client 插件和已配置的代理）：
```agent
type: button
text: "今日要事"
prompt: "请用 vault_read 阅读 提示词/14 今日要事.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
```agent
type: button
text: "复盘本周"
prompt: "请用 vault_read 阅读 提示词/03 每周回顾.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 相关仪表盘
- [[习惯画布|习惯画布]]
- [[每日问题|每日问题]]
- [[任务仪表盘|任务仪表盘]]
- [[项目仪表盘|项目仪表盘]]
- [[看板总览|看板总览]]
- [[智能助手|助手仪表盘]]
- [[设置向导|设置]]
- [[理想一周|理想的一周]] · [[核心价值观|核心价值观]] · [[人生主题|人生主题]]
