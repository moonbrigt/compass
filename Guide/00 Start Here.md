# 从这里开始

本仓库是基于 Mike Schmitz 的视频 [《How I Run My Whole Life Out of Obsidian》](https://www.youtube.com/watch?v=-h7ZAuuNDLE)（Practical PKM，2026-06-26）独立制作的 Obsidian 模板。它并非 Practical PKM 的产品，也未使用其仓库文件。详见 `CREDITS.md`。

第一次使用？先打开 [[Setup|设置]]。那里有设置状态清单，以及第一天、第一周和第一个月的入门步骤。本页是内容地图。

七种工作流共用一个仓库，仪表盘将它们连接起来：

| # | 工作流 | 位置 | 指南 |
| --- | --- | --- | --- |
| 1 | 日记与每日问题 | `01 Journal/Daily`、`Templates/Daily Note.md`、`Templates/Daily Questions Prompt.md`；问题配置在 `Meta/Compass Config.md` | [[03 Workflow - Journaling and Daily Questions\|日记与每日问题]] |
| 2 | 每季度个人静修 | `02 Retreats`、`Templates/Personal Retreat.md` | [[04 Workflow - Personal Retreat\|季度个人静修]] |
| 3 | 多时间跨度计划 | `01 Journal/{Daily,Weekly,Quarterly}`、`03 Planning` | [[05 Workflow - Multi-Scale Planning\|多时间跨度计划]] |
| 4 | 习惯记录 | 日记中的 `habit_*` 属性、`00 Dashboards/Habit Canvas.md` | [[06 Workflow - Habit Tracking\|习惯记录]] |
| 5 | 每日阅读（以《圣经》为示例） | `09 Reading` | [[07 Workflow - Daily Reading\|每日阅读]] |
| 6 | 任务管理 | `08 Tasks/Tasks.md`、`04 Projects`、`05 People`、`00 Dashboards/Task Dashboard.md` | [[08 Workflow - Task Management\|任务管理]] |
| 7 | 写作 | `06 Writing/*` 中的笔记和 Kanban 看板 | [[09 Workflow - Writing\|写作]] |
| + | Compass 仪表盘 | `00 Dashboards/Compass Dashboard.md`、`Meta/views/*.js` | [[10 Compass Dashboard\|Compass 仪表盘]] |
| + | 看板 | `04 Projects/Projects Board.md`、`06 Writing/*/… Board.md`、`00 Dashboards/Boards.md` | [[13 Kanban Boards\|看板]] |
| + | 仓库内 AI | `AGENTS.md`、`Prompts/`、`00 Dashboards/Assistant.md` | [[14 Agent Client and Claude Code\|Agent Client 与 Claude Code]]、[[20 Prompt Library\|提示词库]] |
| + | 知识层（claude-obsidian） | `wiki/`、`inbox/`、`wiki/routing-map.md` | [[15 claude-obsidian\|claude-obsidian 知识层]] |
| + | 网页研究与发布 | Web viewer、SEO、Vault Lens | [[16 SEO, Web Viewer, and Vault Lens\|SEO、网页查看器与 Vault Lens]]、[[17 Search Providers\|搜索服务]] |
| + | Obsidian MCP 桥接 | Local REST API 的 `/mcp`、`.mcp.example.json` | [[19 Obsidian MCP Bridge\|Obsidian MCP 桥接]] |
| + | Life OS 应用 | 原生导航、快速记录、今日状态及受控的 AI 入口 | [[21 Life OS Application\|Life OS 应用]] |

接着阅读 [[01 Principles|设计原则]] 了解设计原则，[[02 Plugins|插件配置]] 了解插件与首次打开步骤，[[11 Build Order|搭建顺序]] 了解启用顺序，[[12 Resources and Links|资料与链接]] 查看资料来源。

## 逐层建立

原作者用五年建立视频中的系统。先选一种工作流，建议从每日写日记开始，连续使用 30 天后再加入下一种。[[Setup|设置]] 按此顺序引导你。

## 维护说明

发布候选仓库由 `scripts/build_template.py` 构建，并通过 `scripts/verify_template.py` 检查；详见 `scripts/RELEASE.md`。
