---
type: book
author: 
year: 
rating: 
status: reading
started: <% tp.date.now("YYYY-MM-DD") %>
finished: 
tags:
  - book
---
## 三句话总结


## 核心观点
- 

## 引文
为每段引文设置块 ID，方便在写作笔记中直接嵌入。

> "" ^quote-1

## 对我的行动有什么影响
- 

```agent
type: button
text: "将此页面归档到知识库"
prompt: "请用 vault_read 阅读 Prompts/12 Research Capture.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: right-pane
```

## 关联的作品
```dataview
LIST
FROM "06 Writing"
WHERE contains(file.outlinks, this.file.link)
```
