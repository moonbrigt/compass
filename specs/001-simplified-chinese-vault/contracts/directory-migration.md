# 中文目录迁移表

本表记录 Compass 首方内容目录和用户可见笔记文件名的迁移。属性键、标签、命令 ID、插件 ID 与第三方二进制保持原样。

| 原目录 | 新目录 |
| --- | --- |
| `00 Dashboards` | `00 仪表盘` |
| `01 Journal` | `01 日记` |
| `01 Journal/Daily` | `01 日记/每日` |
| `01 Journal/Weekly` | `01 日记/每周` |
| `01 Journal/Quarterly` | `01 日记/季度` |
| `02 Retreats` | `02 静修` |
| `03 Planning` | `03 规划` |
| `04 Projects` | `04 项目` |
| `05 People` | `05 人物` |
| `06 Writing` | `06 写作` |
| `06 Writing/Articles` | `06 写作/文章` |
| `06 Writing/Course Content` | `06 写作/课程内容` |
| `06 Writing/Newsletters` | `06 写作/通讯` |
| `06 Writing/YouTube Scripts` | `06 写作/YouTube 脚本` |
| `07 Library` | `07 资料库` |
| `07 Library/Book Notes` | `07 资料库/读书笔记` |
| `08 Tasks` | `08 任务` |
| `09 Reading` | `09 阅读` |
| `09 Reading/Chapters` | `09 阅读/章节` |
| `09 Reading/Study Notes` | `09 阅读/研读笔记` |
| `09 Reading/Topics` | `09 阅读/主题` |
| `09 Reading/Verses` | `09 阅读/经文` |
| `Guide` | `指南` |
| `Meta` | `元数据` |
| `Meta/attachments` | `元数据/附件` |
| `Meta/views` | `元数据/视图` |
| `Prompts` | `提示词` |
| `Templates` | `模板` |

`scripts/template/defaults/` 中与仓库同名的默认目录按同一表迁移。`.obsidian/`、`scripts/`、`wiki/`、`inbox/`、`.agents/`、`.specify/`、`specs/` 等技术或开发目录不改名；其中 `wiki/` 与 `inbox/` 是可选 claude-obsidian 的既有仓库结构。

迁移范围包括 Life OS、DataviewJS、QuickAdd、Templater、Periodic Notes、SEO、热键、CSS、配置、Markdown 内链、模板生成路径、打包脚本和验证脚本。个人使用包排除开发过程文件及维护者检查工具，但保留 `AGENTS.md`、必要的 AI 客户端入口、阅读工具、用户指南和许可文件。

## 文件名迁移

| 原文件 | 新文件 |
| --- | --- |
| `00 仪表盘/Assistant.md` | `00 仪表盘/智能助手.md` |
| `00 仪表盘/Boards.md` | `00 仪表盘/看板总览.md` |
| `00 仪表盘/Compass Dashboard.md` | `00 仪表盘/Compass 总览.md` |
| `00 仪表盘/Daily Questions.md` | `00 仪表盘/每日问题.md` |
| `00 仪表盘/Habit Canvas.md` | `00 仪表盘/习惯画布.md` |
| `00 仪表盘/Projects Dashboard.md` | `00 仪表盘/项目仪表盘.md` |
| `00 仪表盘/Setup.md` | `00 仪表盘/设置向导.md` |
| `00 仪表盘/Task Dashboard.md` | `00 仪表盘/任务仪表盘.md` |
| `02 静修/2026-Q3 Personal Retreat.md` | `02 静修/2026-Q3 个人静修.md` |
| `03 规划/Core Values.md` | `03 规划/核心价值观.md` |
| `03 规划/Ideal Week.md` | `03 规划/理想一周.md` |
| `03 规划/Life Theme.md` | `03 规划/人生主题.md` |
| `04 项目/Example Project - Compass Vault.md` | `04 项目/示例项目 - Compass 仓库.md` |
| `04 项目/Projects Board.md` | `04 项目/项目看板.md` |
| `05 人物/Example Person - Alex Rivera.md` | `05 人物/示例人物 - Alex Rivera.md` |
| `06 写作/YouTube 脚本/YouTube Board.md` | `06 写作/YouTube 脚本/YouTube 看板.md` |
| `06 写作/文章/Article Board.md` | `06 写作/文章/文章看板.md` |
| `06 写作/课程内容/Course Board.md` | `06 写作/课程内容/课程看板.md` |
| `06 写作/通讯/Example Newsletter - Effort not results.md` | `06 写作/通讯/示例通讯 - 重在努力而非结果.md` |
| `06 写作/通讯/Newsletter Board.md` | `06 写作/通讯/通讯看板.md` |
| `08 任务/Tasks.md` | `08 任务/任务总表.md` |
| `09 阅读/Reading Plan.md` | `09 阅读/阅读计划.md` |
| `09 阅读/主题/Creation.md` | `09 阅读/主题/创造.md` |
| `09 阅读/研读笔记/Example Study Note - In the Beginning.md` | `09 阅读/研读笔记/示例研读笔记 - 起初.md` |
| `09 阅读/章节/Genesis 1.md` | `09 阅读/章节/创世记 1.md` |
| `09 阅读/经文/Genesis 1.1.md` | `09 阅读/经文/创世记 1.1.md` |
| `09 阅读/经文/Genesis 1.2.md` | `09 阅读/经文/创世记 1.2.md` |
| `09 阅读/经文/Genesis 1.3.md` | `09 阅读/经文/创世记 1.3.md` |
| `元数据/Compass Config.md` | `元数据/Compass 配置.md` |
| `指南/00 Start Here.md` | `指南/00 从这里开始.md` |
| `指南/01 Principles.md` | `指南/01 原则.md` |
| `指南/02 Plugins.md` | `指南/02 插件.md` |
| `指南/03 Workflow - Journaling and Daily Questions.md` | `指南/03 工作流 - 日记与每日问题.md` |
| `指南/04 Workflow - Personal Retreat.md` | `指南/04 工作流 - 个人静修.md` |
| `指南/05 Workflow - Multi-Scale Planning.md` | `指南/05 工作流 - 多尺度规划.md` |
| `指南/06 Workflow - Habit Tracking.md` | `指南/06 工作流 - 习惯追踪.md` |
| `指南/07 Workflow - Daily Reading.md` | `指南/07 工作流 - 每日阅读.md` |
| `指南/08 Workflow - Task Management.md` | `指南/08 工作流 - 任务管理.md` |
| `指南/09 Workflow - Writing.md` | `指南/09 工作流 - 写作.md` |
| `指南/10 Compass Dashboard.md` | `指南/10 Compass 仪表盘.md` |
| `指南/11 Build Order.md` | `指南/11 搭建顺序.md` |
| `指南/12 Resources and Links.md` | `指南/12 资源与链接.md` |
| `指南/13 Kanban Boards.md` | `指南/13 看板.md` |
| `指南/14 Agent Client and Claude Code.md` | `指南/14 Agent Client 与 Claude Code.md` |
| `指南/15 claude-obsidian.md` | `指南/15 claude-obsidian 知识层.md` |
| `指南/16 SEO, Web Viewer, and Vault Lens.md` | `指南/16 SEO、Web Viewer 与 Vault Lens.md` |
| `指南/17 Search Providers.md` | `指南/17 搜索服务.md` |
| `指南/19 Obsidian MCP Bridge.md` | `指南/19 Obsidian MCP 桥接.md` |
| `指南/20 Prompt Library.md` | `指南/20 提示词库.md` |
| `指南/21 Life OS Application.md` | `指南/21 Life OS 应用.md` |
| `指南/22 Data Definitions.md` | `指南/22 数据定义.md` |
| `指南/23 Native Acceptance.md` | `指南/23 原生验收.md` |
| `指南/Source - Video Analysis.md` | `指南/来源 - 视频分析.md` |
| `提示词/01 Morning Start.md` | `提示词/01 早晨开始.md` |
| `提示词/02 End of Day Coaching.md` | `提示词/02 日终复盘辅导.md` |
| `提示词/03 Weekly Review.md` | `提示词/03 每周回顾.md` |
| `提示词/04 Retreat Prep.md` | `提示词/04 静修准备.md` |
| `提示词/05 Retreat Facilitation.md` | `提示词/05 静修引导.md` |
| `提示词/06 Task Triage.md` | `提示词/06 任务梳理.md` |
| `提示词/07 Meeting Prep.md` | `提示词/07 会议准备.md` |
| `提示词/08 Project Kickoff.md` | `提示词/08 项目启动.md` |
| `提示词/09 Board Grooming.md` | `提示词/09 看板整理.md` |
| `提示词/10 Writing Pipeline.md` | `提示词/10 写作流程.md` |
| `提示词/11 SEO Pre-publish Audit.md` | `提示词/11 SEO 发布前检查.md` |
| `提示词/12 Research Capture.md` | `提示词/12 研究资料收集.md` |
| `提示词/13 Trend Analysis.md` | `提示词/13 趋势分析.md` |
| `提示词/14 What Matters Today.md` | `提示词/14 今日要事.md` |
| `提示词/15 Vault Health Check.md` | `提示词/15 仓库健康检查.md` |
| `提示词/16 Onboarding Assistant.md` | `提示词/16 入门助手.md` |
| `模板/Article.md` | `模板/文章.md` |
| `模板/Book Note.md` | `模板/读书笔记.md` |
| `模板/Course Lesson.md` | `模板/课程课时.md` |
| `模板/Daily Note.md` | `模板/每日笔记.md` |
| `模板/Daily Questions Prompt.md` | `模板/每日问题提示.md` |
| `模板/Newsletter.md` | `模板/通讯.md` |
| `模板/Person.md` | `模板/人物.md` |
| `模板/Personal Retreat.md` | `模板/个人静修.md` |
| `模板/Project.md` | `模板/项目.md` |
| `模板/Quarterly Note.md` | `模板/季度笔记.md` |
| `模板/Study Note.md` | `模板/研读笔记.md` |
| `模板/Weekly Note.md` | `模板/每周笔记.md` |
| `模板/YouTube Script.md` | `模板/YouTube 脚本.md` |

`scripts/template/defaults/` 下存在的同名默认文件按同一映射迁移。日期文件名、原书名 `Triggers (Marshall Goldsmith).md` 与技术目录保留原样。
