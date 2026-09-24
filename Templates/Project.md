---
type: project
status: active
area: 
quarter: <% tp.date.now("YYYY-[Q]Q") %>
started: <% tp.date.now("YYYY-MM-DD") %>
due: 
people: []
tags:
  - project
---
在仓库任意位置给任务加上 `#project/<% tp.file.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "") %>`，任务就会汇总到这里。点击任务即可回到它的背景笔记。

```agent
type: button
text: "启动这个项目"
prompt: "请用 vault_read 阅读 Prompts/08 Project Kickoff.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 预期成果
完成时应是什么样子：
- 

## 下一步行动
```tasks
not done
tags include #project/<% tp.file.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "") %>
sort by due
```

## 笔记内任务
- [ ] 第一步 #project/<% tp.file.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "") %>

## 笔记


## 日志
- <% tp.date.now("YYYY-MM-DD") %> 已创建。

## 已完成
```tasks
done
tags include #project/<% tp.file.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "") %>
sort by done reverse
limit 20
```
