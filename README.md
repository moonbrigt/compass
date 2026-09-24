<p align="center"><img src="元数据/附件/cover.svg" alt="Compass 简体中文版封面" width="100%"></p>

# Compass Life OS 简体中文版

*每天晚上诚实回答一组问题，让记录、规划和行动在同一仓库中连接起来。*

Compass 是一个完整的 Obsidian 仓库模板，独立实现 Mike Schmitz 在《How I Run My Whole Life Out of Obsidian》中介绍的七项工作流：每日问题与日记、季度个人静修、多尺度规划、习惯追踪、每日阅读、任务管理和写作看板。DataviewJS 仪表盘把它们连起来；仓库自带的 Life OS 应用提供统一导航与捕获，AI 助手读取 `AGENTS.md` 并使用需经批准的提示词库。正式数据仍是普通 Markdown 文件与属性。仓库附带十个社区插件及其许可文件，也附带自有的 Life OS 插件。

**状态：简体中文目录候选，尚未公开发布。** 旧版候选的核心桌面流程曾在 Obsidian 1.13.7 中试用；本版目录迁移尚未完成 Obsidian 原生验收。要求 Obsidian 1.13.1 或更新版本。检查结果见开发分支的 `specs/001-simplified-chinese-vault/acceptance.md`。

## 演示视频

[![观看 Daniel Agrici 的 Compass 演示](https://i.ytimg.com/vi/0mUx4z6M5AU/hqdefault.jpg)](https://www.youtube.com/watch?v=0mUx4z6M5AU)

[观看 Daniel Agrici 的 Compass 演示](https://www.youtube.com/watch?v=0mUx4z6M5AU)。

## 方法来源

[![观看 Mike Schmitz 的原视频](https://img.youtube.com/vi/-h7ZAuuNDLE/maxresdefault.jpg)](https://www.youtube.com/watch?v=-h7ZAuuNDLE)

[Mike Schmitz（Practical PKM）的视频](https://www.youtube.com/watch?v=-h7ZAuuNDLE)发布于 2026-06-26。Compass 是对视频所述方法的独立实现，与 Practical PKM、LifeHQ 或 Obsidian Starter Vault 没有关联或官方认可，也不包含它们的文件或正文。参见 `CREDITS.md`。

## 快速开始

1. 使用本地交付的中文版 ZIP；解压后的根目录本身就是 Obsidian 仓库。
2. 在 Obsidian 中选择“将文件夹作为仓库打开”。
3. Obsidian 询问信任仓库作者时，确认后启用第三方插件。在命令面板运行“重新加载 Obsidian（不保存当前编辑内容）”，使十个社区插件和 Life OS 生效；加载完成后 Life OS 会自动打开。
4. 阅读[入门指南](指南/00%20Start%20Here.md)，打开 `00 仪表盘/Setup.md`，按照自检提示完成设置。
5. 今晚按 `Ctrl/Cmd+Shift+D` 打开日记，再按 `Ctrl/Cmd+Shift+Q` 回答每日问题（1–10 分），在 `## 日记` 下写一行即可。其他工作流可等这一项稳定运行 30 天后再加入。

带 `example` 标签的是仪表盘首次打开时使用的演示数据；“设置”页会提醒在建立真实记录后删除示例。

## 目录

```text
00 仪表盘/   设置、Compass、习惯、每日问题、任务、项目、看板、助手仪表盘
01 日记/      每日、每周、每季度笔记
02 静修/     YYYY-QN Personal Retreat 个人静修笔记，属性含生命之轮分数
03 规划/     人生主题、核心价值观（含角色）、理想一周
04 项目/     项目笔记、#project/<slug> 任务和项目看板
05 人物/       人物笔记、#p/<slug> 任务及 #discuss 待讨论事项
06 写作/      通讯、视频脚本、文章、课程内容及各自看板
07 资料库/      读书笔记，可用块 ID 嵌入引文
08 任务/        Tasks.md，任务总表
09 阅读/      阅读计划、章节、经节、研读笔记与主题
提示词/         16 篇智能体提示词
模板/       Templater 模板；属性列表来自 元数据/Compass Config.md
元数据/            唯一配置、视图/*.js 仪表盘组件、版本说明
指南/           原则、插件、各工作流、智能体、MCP 与提示词说明
wiki/, inbox/    可选 claude-obsidian 知识层；未安装插件时仍是普通 Markdown
scripts/         阅读计划生成、经文拆分、模板构建与验证
.github/         CI 验证流程及议题模板
```

根目录还包括 `CHANGELOG.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md`、`CREDITS.md`、`LICENSE`、`LICENSE-GUIDE.md`、`THIRD_PARTY_NOTICES.md`。`.claude-obsidian.json` 标记知识层；`AGENTS.md` 是共用的智能体规则，`CLAUDE.md` 与 `GEMINI.md` 指向它；`.claude/settings.json` 预设 Claude Code 的只读 MCP 工具；`.mcp.example.json` 示范如何连接 Obsidian MCP 服务。

`元数据/Compass Config.md` 集中保存问题、习惯、生命之轮领域、目录、前缀与出生日期。仪表盘按 `dq_*`、`habit_*`、`wheel_*` 前缀发现属性，因此改动配置后新笔记与相关视图会相应变化。

## 七项工作流

| 编号 | 工作流 | 主要文件 | 指南 |
| --- | --- | --- | --- |
| 1 | 日记与每日问题 | `01 日记/每日`、`模板/Daily Note.md`、`模板/Daily Questions Prompt.md`、`元数据/Compass Config.md` | `指南/03 Workflow - Journaling and Daily Questions.md` |
| 2 | 季度个人静修 | `02 静修`、`模板/Personal Retreat.md` | `指南/04 Workflow - Personal Retreat.md` |
| 3 | 多尺度规划 | `01 日记/{Daily,Weekly,Quarterly}`、`03 规划` | `指南/05 Workflow - Multi-Scale Planning.md` |
| 4 | 习惯追踪 | 日记中的 `habit_*`、`00 仪表盘/Habit Canvas.md` | `指南/06 Workflow - Habit Tracking.md` |
| 5 | 每日阅读（以《圣经》为例） | `09 阅读` | `指南/07 Workflow - Daily Reading.md` |
| 6 | 任务管理 | `08 任务/Tasks.md`、`04 项目`、`05 人物`、任务仪表盘 | `指南/08 Workflow - Task Management.md` |
| 7 | 写作 | `06 写作/*` 与 Kanban 看板 | `指南/09 Workflow - Writing.md` |

此外还有 Compass 仪表盘（`指南/10`）、看板（`指南/13`）、仓库中的 AI（`指南/14`、`指南/20`）、claude-obsidian 知识层（`指南/15`）、研究与发布工具（`指南/16`、`指南/17`）及 Obsidian MCP 桥接（`指南/19`）。从[入门指南](指南/00%20Start%20Here.md)开始阅读。每次只加一个工作流；建议先把日记稳定运行 30 天。“设置”页按此顺序提示。

## 附带插件

十个社区插件已放在 `.obsidian/plugins/` 并预设启用，各有版本及许可记录。与上游发布包逐字节核对仍是独立的发布检查。仓库自有的 `life-os-app` 与它们一同安装。首次打开检查见 `指南/02 Plugins.md`。

| 插件 | ID | 版本 | 许可 |
| --- | --- | --- | --- |
| Dataview | `dataview` | 0.5.68 | MIT |
| Templater | `templater-obsidian` | 2.25.0 | AGPL-3.0 |
| Periodic Notes | `periodic-notes` | 0.0.17 | MIT |
| QuickAdd | `quickadd` | 2.23.0 | MIT |
| Tasks | `obsidian-tasks-plugin` | 8.4.0 | MIT |
| Kanban | `obsidian-kanban` | 2.0.51 | GPL-3.0 |
| Omnisearch | `omnisearch` | 1.30.1 | GPL-3.0 |
| Local REST API | `obsidian-local-rest-api` | 5.1.0 | MIT |
| Agent Client | `agent-client` | 0.12.1 | Apache-2.0 |
| SEO | `seo` | 0.5.6 | MIT |

自有的 Life OS（`life-os-app`）单独标注版本，采用 MIT 许可，负责原生导航、捕获和实时仪表盘，详见 `指南/21 Life OS Application.md`。上游仓库和版本标签见 `THIRD_PARTY_NOTICES.md`；本仓库不附带 Obsidian 程序。

## 仓库中的智能体

- `AGENTS.md` 规定目录、属性、读取与写入边界；`CLAUDE.md`、`GEMINI.md` 指向它。
- `提示词/` 含 16 项重复工作，每篇都有风险级别与按钮，详见 `指南/20 Prompt Library.md`。
- Agent Client 在侧栏或笔记里运行本机智能体；自动批准默认关闭。写入前应检查差异并批准，详见 `指南/14 Agent Client and Claude Code.md`。
- Local REST API 5.x 可在 `http://127.0.0.1:27123/mcp` 提供 16 个 MCP 工具，连接示例见 `.mcp.example.json`；Claude Code 的只读预授权见 `.claude/settings.json`。详见 `指南/19 Obsidian MCP Bridge.md`。
- 模板不附带密钥。Local REST API 首次加载时生成每台电脑独有的密钥，使用者在仓库外的客户端配置中注册。`.mcp.json`、智能体会话和导出的聊天已被构建流程排除。

## 构建与发布

![验证状态](https://github.com/AgriciDaniel/compass/actions/workflows/verify.yml/badge.svg)

`zh-CN` 分支是维护者源码，含 `specs/`、`.specify/` 等开发过程文件。个人使用请采用打包后的 ZIP。构建副本不会反写源仓库：

```bash
python3 scripts/verify_release_safety.py
python3 scripts/build_template.py --live . --out ../compass-builds --name Compass-zh-CN-personal --version 1.1.0-zh.10 --zip
python3 scripts/verify_template.py ../compass-builds/Compass-zh-CN-personal
```

`build_template.py` 排除机器状态，只保留带 `example` 标签的演示笔记，恢复经审核的默认值，移除插件设置中的本机信息，写入版本与最小工作区，最后验证并打包。`verify_template.py` 在不满足要求时返回非零状态：检查私密信息、密钥、证书、插件设置与许可、路径和 wikilink、JavaScript 语法及大小限制。每次推送或拉取请求，`verify` 流程都会运行验证；维护清单见 `scripts/RELEASE.md`，变更见 `CHANGELOG.md`。

仓库没有原位事务升级器。升级时先备份完整仓库，把新版本解压到旁边，再逐项审查并迁移个人笔记、配置和模板；不要整目录替换正在使用的 `.obsidian`。备份只有经过恢复演练才算已验证。参见 `scripts/RELEASE.md` 与 `指南/23 Native Acceptance.md`。

## 致谢与许可

工作流参考 Mike Schmitz 的公开视频。每日问题参考 Marshall Goldsmith 与 Mark Reiter 的《Triggers》（2015）；多尺度规划参考 Cal Newport。完整说明见 `CREDITS.md`。

代码、模板、仪表盘、脚本和配置使用 MIT（`LICENSE`）；`指南/` 的说明文字使用 CC BY 4.0（`LICENSE-GUIDE.md`）。`.obsidian/plugins/` 中的第三方插件保留各自许可，见 `THIRD_PARTY_NOTICES.md`。社区规则见 `CODE_OF_CONDUCT.md`；参与方式见 `CONTRIBUTING.md`；安全说明见 `SECURITY.md`。
