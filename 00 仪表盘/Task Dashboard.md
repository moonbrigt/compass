本页提供**任务建议**。阅读后选出真正要做的事，再用纸质笔记本或日历安排时间。“电脑是大脑，笔记本是清单。”

```agent
type: button
text: "整理收件箱任务"
prompt: "请用 vault_read 阅读 提示词/06 Task Triage.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```
```agent
type: button
text: "今日要事"
prompt: "请用 vault_read 阅读 提示词/14 What Matters Today.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

使用 QuickAdd 命令**添加任务**，将事项统一记入 [[Tasks|任务总表]]（无需日常翻阅的任务总表）。通过 `#project/<slug>` 或 `#p/<person>` 标签将任务关联到项目或人物。下方查询会按时机显示相关任务。

## 逾期
```tasks
not done
path does not include wiki/
due before today
sort by due
group by filename
```

## 今日
```tasks
not done
path does not include wiki/
(due on today) OR (scheduled on today)
path does not include 09 阅读/Reading Plan
sort by priority
group by filename
```

## 未来 7 天
```tasks
not done
path does not include wiki/
due after today
due before in 8 days
sort by due
group by due
```

## 待讨论（按人物）
```tasks
not done
path does not include wiki/
tags include #discuss
group by tags
sort by created
```

## 未指定日期的高优先级任务
```tasks
not done
path does not include wiki/
no due date
(priority is high) OR (priority is highest)
group by filename
```

## 收件箱（未标记、未定日期的任务）
```tasks
not done
path does not include wiki/
path includes 08 任务/Tasks
no due date
tags do not include #project
tags do not include #p/
limit 25
```

## 本周已完成
```tasks
done after 7 days ago
path does not include wiki/
group by done
```
