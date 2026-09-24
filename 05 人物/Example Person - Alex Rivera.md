---
type: person
role: 示例
company:
email:
meets: weekly
tags:
  - person
  - example
---
标签：`#p/example-person-alex-rivera`

## 待讨论
```tasks
not done
tags include #discuss
tags include #p/example-person-alex-rivera
sort by created
```

## 与此人有关的未完成任务
```tasks
not done
tags include #p/example-person-alex-rivera
tags do not include #discuss
sort by due
```

## 共同参与的项目
```dataview
LIST
FROM "04 项目"
WHERE contains(people, this.file.link) AND status != "done"
```

## 笔记
- 这是一篇示例人物笔记。“待讨论”查询会收集仓库中带有 `#discuss #p/example-person-alex-rivera` 标签的任务；会面前可打开本页。

## 会面记录
- 2026-08-26 已创建。
