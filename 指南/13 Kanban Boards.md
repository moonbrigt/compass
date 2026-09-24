# Kanban 看板

使用 Kanban 2.0.51（`obsidian-kanban`；[项目仓库](https://github.com/community-archive/obsidian-kanban)）。看板本质上仍是 Markdown：每个 `## 标题` 是一列，每行 `- [ ]` 是一张卡片；即使插件不可用，文件仍可搜索、链接和阅读。

## 本仓库的看板

| 看板 | 列 | 卡片来源 |
| --- | --- | --- |
| `04 项目/Projects Board` | 想法 → 进行中 → 已完成 | QuickAdd 的“💡 项目想法 → 项目看板”；卡片可链接项目笔记 |
| `06 写作/通讯/Newsletter Board` | 同上 | “✉️ 通讯选题 → 想法” |
| `06 写作/YouTube 脚本/YouTube Board` | 同上 | “🎬 视频选题 → 想法” |
| `06 写作/文章/Article Board` | 同上 | “📰 文章选题 → 想法” |
| `06 写作/课程内容/Course Board` | 同上 | 手动添加 |

QuickAdd 的写作选题捕获到各看板的 `## 想法` 列；该标题必须与 QuickAdd 的 `insertAfter` 配置一致。

## 配置关系

- 全局默认项位于 `.obsidian/plugins/obsidian-kanban/data.json`：输入 `@{2026-09-30}` 可链接当日日记；显示相对日期；归档时附日期。
- 各看板末尾的 `%% kanban:settings %%` 设置新笔记文件夹与模板。从通讯看板将卡片转为笔记时，就会在 `06 写作/通讯` 使用 `模板/Newsletter.md` 创建。
- `元数据/视图/boards.js` 读取带 `kanban-plugin` 属性的笔记并统计各列数量。[[Compass Dashboard|Compass 仪表盘]] 显示简版，[[Boards|看板总览]] 显示完整视图。`元数据/Compass Config.md` 的 `board_done_lanes` 指定哪些列视为完成。

每种工作放一个看板。把想法送到第一列，工作写在卡片链接的笔记中，确实完成或发表后才移到完成列；静修时归档旧卡片。

插件项目曾公开寻求维护者。由于数据仍是普通 Markdown，即使未来换插件，看板内容也能迁移。
