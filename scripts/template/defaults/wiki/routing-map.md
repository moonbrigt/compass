---
type: meta
title: 内容路由表
status: evergreen
created: 2026-08-26
updated: 2026-08-26
tags:
  - meta
  - routing
---

# 内容路由表

本表规定 claude-obsidian 在 Compass 仓库中如何存放内容。插件只能写入 `wiki/`（以及用于导入原始内容的 `.raw/`）；下列规则决定目标子文件夹，以及哪些内容应建立链接而非复制。

| 操作 | 目标位置 | 规则 |
| --- | --- | --- |
| 使用 `/save` 保存答案、决定或洞见 | `wiki/concepts/<slug>.md` | 一个想法一篇笔记，并链接其来源的 Compass 笔记（日记、个人静修或项目）。 |
| 使用 `/save` 保存会话摘要 | `wiki/log.md` | 追加记录，新的排在前面。 |
| 导入书籍、文章、逐字稿或网页剪藏 | `wiki/sources/<slug>.md`，并增加来源台账条目 | 用户手写的读书笔记留在 `07 Library/Book Notes`（Templater 文件夹模板、带块 ID 的引文），不要移动。 |
| 与人物有关的内容 | 链接 `05 People/<Name>.md` | 已有人物笔记时，不要再创建 `wiki/entities/<name>.md`。 |
| 与项目有关的内容 | 链接 `04 Projects/<Name>.md` | 同上。 |
| 日记、静修、计划、习惯和任务内容 | 不导入 | 这些是个人工作数据，不增加来源台账条目，也不纳入来源追踪模型。 |
| 留待研究的问题 | `wiki/index.md` → 待研究问题 | 仅在明确同意网络访问后运行 `autoresearch`。 |

模式为 `generic`（没有 `.vault-meta/mode.json`）。不要切换到 PARA，否则会在 `wiki/` 下重复建立 `04 Projects` 和 `03 Planning` 的内容。
