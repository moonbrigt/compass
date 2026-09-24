这里实时读取仓库中的所有 Kanban 看板。卡片从左向右推进，最后的“已完成”或“已发布”列计为完成。看板本身是 Markdown 笔记，因此 QuickAdd 的“想法”命令会直接把内容加入“待办池”列。

```agent
type: button
text: "整理看板"
prompt: "请用 vault_read 阅读 Prompts/09 Board Grooming.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 概览
```dataviewjs
await dv.view("Meta/views/boards", { compact: true });
```

## 项目
```dataviewjs
await dv.view("Meta/views/boards", { folder: "04 Projects" });
```

## 写作
```dataviewjs
await dv.view("Meta/views/boards", { folder: "06 Writing" });
```

## 添加看板
1. 在任意位置创建笔记，打开命令面板并运行 **Kanban: Create new board**，或在属性中添加 `kanban-plugin: board`。
2. 命名各列。将完成状态的列放在最后，并命名为“已完成”或“已发布”，以便组件正确统计；可在 [[Compass Config|Compass 配置]] 中编辑 `board_done_lanes` 列表。
3. 可选：在看板设置中指定“新笔记文件夹”和“笔记模板”，使卡片转为笔记时使用正确模板。
