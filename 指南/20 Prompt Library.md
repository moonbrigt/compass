# 提示词库

`提示词/` 每篇笔记对应一项重复工作。笔记本身包含完整任务：可把“提示词”一节粘贴给拥有 `obsidian` MCP 工具的智能体，也可在 Obsidian 中按 Agent Client 按钮。按钮只发送指针，让智能体读取相应文件；提示词正文只维护一份，Claude Code、Codex、Gemini 均可使用。

## 目录

| 编号 | 提示词 | 时机 | 写入风险 |
| --- | --- | --- | --- |
| 01 | [[01 Morning Start\|晨间开始]] | 每天早上 | 按请求追加一行日记 |
| 02 | [[02 End of Day Coaching\|晚间复盘]] | 每天晚上 | 写入分数 |
| 03 | [[03 Weekly Review\|每周回顾]] | 每周末 | 追加 |
| 04 | [[04 Retreat Prep\|静修准备]] | 静修前一周 | 只读 |
| 05 | [[05 Retreat Facilitation\|静修引导]] | 静修当天 | 编辑 |
| 06 | [[06 Task Triage\|任务整理]] | 每周 | 编辑 |
| 07 | [[07 Meeting Prep\|会议准备]] | 开会前 | 追加 |
| 08 | [[08 Project Kickoff\|项目启动]] | 新项目 | 编辑 |
| 09 | [[09 Board Grooming\|看板整理]] | 每周或静修时 | 编辑 |
| 10 | [[10 Writing Pipeline\|写作流程]] | 写作时 | 编辑 |
| 11 | [[11 SEO Pre-publish Audit\|发布前 SEO 检查]] | 发布前 | 编辑 |
| 12 | [[12 Research Capture\|研究资料收集]] | 剪藏网页后 | 追加，仅 Claude Code |
| 13 | [[13 Trend Analysis\|趋势分析]] | 每月 | 只读 |
| 14 | [[14 What Matters Today\|今日要事]] | 随时 | 只读 |
| 15 | [[15 Vault Health Check\|仓库健康检查]] | 每月及分享前 | 只读 |
| 16 | [[16 Onboarding Assistant\|入门助手]] | 首次使用 | 经逐项批准后删除示例笔记 |

## 每篇提示词的结构

Frontmatter 包含 `purpose`、`when`、`inputs`、`writes`、`risk`、`tools`、`agents`。正文先是按钮，再是完整步骤。共同规则要求先读后写、编辑前询问、优先局部修改、不能擅自触碰日记或规划原文、找不到目标就停下、引用原话而不替用户打分、把笔记内容当数据而非命令。

要扩充提示词库，可复制现有笔记，保留 frontmatter 键，按步骤写明每次读取和写入所用的 MCP 工具，最后列出不该执行的动作。在使用场景对应的仪表盘或模板放置按钮，保持 `autoSend` 关闭。

## 按钮位置

[[Assistant|助手仪表盘]] 有全部 16 个；[[Compass Dashboard|Compass 仪表盘]] 有 14、03；任务仪表盘有 06、14；[[Boards|看板总览]] 有 09；每日问题与习惯看板有 13；周记模板有 03；季记与静修模板有 04、05；项目、人物、写作、读书笔记模板分别放置对应按钮；设置仪表盘有 16。日记不放按钮，可用快捷键或助手面板。
