# Compass 简体中文版验收记录

日期：2026-09-24。源工作区：`F:\compass-zh-cn`，分支：`zh-CN`，基线：`origin/main` 的 `ba2c1cf73a8e305c02fa8819f0236f028fd972b3`。现用英文仓库 `F:\compass` 未用于打包，也未由本次汉化修改。

## 交付候选

| 版本 | 本地归档 | SHA256 | 静态验证 | 临时解压恢复 |
| --- | --- | --- | --- | --- |
| 完整版 1.1.0-zh.6 | `F:\compass-zh-cn-candidates\Compass-zh-CN-personal-template-v1.1.0-zh.6.zip` | `17546cc8ed662fa0f9719cf04c06bdda474863530cd4aaf1c2adfd2c2ec91be9` | 165 项通过，0 项失败 | 208 个文件与内置清单逐一匹配 |
| 精简版 1.1.0-zh.6（不含阅读模块） | `F:\compass-zh-cn-candidates\Compass-zh-CN-Lite-personal-template-v1.1.0-zh.6-without-reading.zip` | `0a03e61cb1004dc4e6995e841636acb002f991e1926d32e2f786b1724673a8a8` | 163 项通过，0 项失败 | 197 个文件与内置清单逐一匹配 |

两个 ZIP 都有同名外置 `.sha256` 文件。上述恢复检查只针对交付归档，在一次性目录中解压；未恢复私人仓库备份。最终完整 ZIP 与精简 ZIP 均保持未在 Obsidian 打开的原始构建状态。

## 汉化覆盖与静态检查

- `scripts/locale_audit.py --english`：143/143 个清单目标完成，0 个待处理；唯一英文散文候选是资料链接中的专有名称 `NeuYear Personal Retreat Planner`。检查保留前置属性键、wikilink 目标、Templater 块、QuickAdd 命令 ID 与选项 ID，并检查中文链接别名及 Markdown 表格转义。
- `node scripts/verify_life_os_app.mjs .`：62 项通过。`node scripts/verify_assistant_contracts.mjs .`：16 项工作流的契约通过，按钮自动发送保持关闭。`python scripts/verify_release_safety.py`：11 项通过。
- 首方 Life OS 和 9 个 `Meta/views/*.js` 通过 `node --check`；`git -c core.safecrlf=false diff --check` 通过。
- 构建器分别在全量和去除阅读模块后运行 `verify_template.py`；`verify_archive_restore.py` 对两个 ZIP 的外置 SHA256、归档路径与解压后每个文件的内置清单做了核对。
- 完整版保留中文 `cover.svg`，移除旧英文 `cover.png`。规范化文件名、路径、属性键、标签、命令 ID 和第三方插件文件保持原有技术含义。

## Windows 桌面 Obsidian 试用

环境：Windows，Obsidian 1.13.7。原生试用对象是隔离候选 `F:\compass-zh-cn-candidates\Compass-zh-CN-final`，其未打开前的 ZIP 为 `Compass-zh-CN-final-template-v1.1.0-zh.3.zip`，SHA256 为 `ef70e4e0ebbc873c6701253924c320d74569be7d0d7301507aa1ac4f67db412e`。用户亲自在 Obsidian 中信任该仓库并启用插件。

| 操作 | 实际观察 |
| --- | --- |
| 首次加载并重载 | Life OS 自动打开；Setup 中 Life OS 命令、CSS 片段和快捷键为已就绪，必需项目显示 15/26。示例静修没有被当作真实静修。 |
| Life OS | 首页、导航、项目卡片和完整分组的中文捕获菜单正常显示；项目状态显示“进行中”。点击“日记”可进入 QuickAdd 提示。 |
| Compass Dashboard | 生活之轮、每日问题、习惯、看板、人生时间和询问助手组件显示中文，观察时没有可见脚本错误。 |
| 日记 | `Ctrl+Shift+D` 创建 `2026-09-24.md`；正文标题为中文，`dq_*`、`habit_*` 属性存在，没有未执行的 `<% ... %>`。 |
| 项目 | QuickAdd 创建 `04 Projects/最终验收项目.md`；正文为中文，属性和 `#project/最终验收项目` 任务标签保留。Life OS 项目卡片显示“最终验收项目 进行中 1 项带标签的未完成任务”。 |
| 捕获追加 | 前一个隔离候选 `Compass-zh-CN-r2` 中，“日记”路由把虚构验收文字追加到 `## 日记`；当前试用仓库仅检查了进入提示，不重复写入。 |
| 文档导航 | 将最终修订后的封面、README、入门页和相关指南复制进已信任的隔离试用仓库；中文版封面在阅读视图显示。README →“入门指南”→“日记与每日问题”、以及入门页→“插件配置”链接均打开正确笔记；指南表格的中文别名可点击。 |

完整交付 ZIP 的 Life OS 文件、`Meta/views/*.js` 和 QuickAdd 配置与原生试用的 1.1.0-zh.3 ZIP 逐字节相同。后续改动涉及中文封面、文档、可见 wikilink 别名、模板中的可见链接以及构建和验证脚本；最终 1.1.0-zh.6 ZIP 自身没有作为一个新仓库再次打开。因此桌面观察证明上述试用流程，不能扩展为对最终 ZIP 所有原生行为的逐项验收。精简版尚未做 Obsidian 原生试用。

## 保留原文与未验证范围

- 文件名、目录、属性键、命令 ID、模板语法和 `#example` 等机器标识保留原文；书名、人名、产品名和原文引用按语义保留。Obsidian 自身与第三方插件的界面语言取决于其各自实现；本次没有修改第三方二进制或许可证。
- 未逐项运行连续两次重载、同名笔记冲突、任务来源行定位、月历空日期、图表数值比对、知识图谱全部操作、无鼠标全程导航、窄窗格与 200% 缩放、浅色与深色主题。
- 未测试移动端、真实 AI 服务商请求、Local REST API/MCP 实际连接、外部日历、私人备份恢复和插件上游二进制再分发来源。可选浏览器模拟脚本 `scripts/verify_dashboard_view.mjs` 因本机缺少 `playwright` 模块未运行。
- 打开过的隔离试用仓库含验收笔记和 Obsidian 本机生成的 Local REST API 状态，不作为交付包。只使用上表 SHA256 对应的原始 ZIP。分支未推送，也未创建公开 Release。

## 中文目录与个人交付包修订（1.1.0-zh.9）

用户要求把首方内容目录改为中文，并确认开发过程文件与个人使用包分离。源码仍位于 `F:\compass-zh-cn` 的 `zh-CN` 分支；`F:\Memory layer` 未写入项目或过程文件。目录迁移表见 `contracts/directory-migration.md`；`.obsidian/`、`scripts/`、`wiki/`、`inbox/` 等技术路径保留原名。

新版完整包为 `F:\compass-zh-cn-candidates\Compass-zh-CN-personal-v4-template-v1.1.0-zh.9.zip`，SHA256 为 `1777f69594946bbf6aa1ac90a522fdeb1c4d453a42e6bc934704729fc7b8f2dd`，相邻目录为未打开的构建副本。包内没有 `specs/`、`.specify/`、`.agents/`、维护者验证脚本、维护说明、更新日志或相关断链；保留 `AGENTS.md`、只读 Claude 设置、知识层标记、两项阅读工具、用户指南和许可文件。

| 检查 | 结果 |
| --- | --- |
| 汉化覆盖和基线路径映射 | 143/143 个目标完成；英文启发式仅发现保留的资料名 `NeuYear Personal Retreat Planner` |
| Life OS 与助手契约 | 首方应用 62 项通过；16 项助手工作流契约通过 |
| 发布安全与个人包 | 11 项发布安全测试通过；个人包 200 项检查通过，0 项失败；QuickAdd 与 Templater 均指向 `模板` |
| 归档恢复 | 外置 SHA256 与内置清单一致；临时解压的 195 个文件逐一匹配 |
| 目录及链接 | 旧首方目录引用未出现在个人包；3 个本地 Markdown/HTML 路径链接可解析，仪表盘 `dv.view` 路径逐项通过验证 |

本版没有在 Obsidian 中作为新仓库打开，以免增加用户的仓库列表项。因此旧候选的原生试用结果不能证明目录迁移后的运行行为。`verify_brain_view.mjs` 因本机缺少 `playwright` 模块未运行；移动端、真实 AI 连接和私人备份恢复仍未验证。精简版未重新构建。此前 `v2` 和 `v3` 均为中间候选，不是本次交付物。清理 `v2` 的删除命令被自动审批拦截，故中间候选仍留在候选目录，但未进入本版 ZIP。
