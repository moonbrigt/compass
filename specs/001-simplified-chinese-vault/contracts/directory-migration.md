# 中文目录迁移表

本表只迁移 Compass 首方内容目录。文件名、属性键、标签、命令 ID、插件 ID 与第三方二进制保持原样。

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
