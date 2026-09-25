# Tasks: Compass 简体中文版

**Input**: `specs/001-simplified-chinese-vault/` 中的 spec、plan、research、data-model、contract 和 quickstart

**Prerequisites**: `zh-CN` 独立工作区已建立，Spec Kit 项目已初始化

**Organization**: 按用户故事安排；所有任务完成后才交付完整汉化版。

## Phase 1: Setup

- [X] T001 盘点 `.obsidian/plugins/life-os-app/main.js`、`Meta/views/*.js`、`00 Dashboards/*.md`、`Templates/*.md`、`Prompts/*.md`、`Guide/*.md` 及其他自有 Markdown，在 `specs/001-simplified-chinese-vault/inventory.md` 列出可翻译与保留项。
- [X] T002 在 `specs/001-simplified-chinese-vault/glossary.md` 定义 Life OS、Setup、日记、复盘、任务、习惯、生活领域等简体中文术语及原文保留规则。

## Phase 2: Foundational

- [X] T003 在 `scripts/locale_audit.py` 建立覆盖清单、稳定标识与代码占位符审计，并让检查以 `specs/001-simplified-chinese-vault/inventory.md` 为范围来源。

**Checkpoint**: 可追踪所有待译文案与不可翻译的技术契约。

## Phase 3: User Story 1 - 在中文界面中开始使用 (Priority: P1)

**Goal**: Life OS、Setup 和各仪表盘以简体中文呈现且保持导航、捕获和汇总行为。

**Independent Test**: 在隔离仓库中打开 Life OS、Setup、Compass Dashboard，检查导航、按钮、图表和空状态。

- [X] T004 [US1] 翻译 `.obsidian/plugins/life-os-app/main.js` 与 `.obsidian/plugins/life-os-app/manifest.json` 中的首方用户界面文案，保留控制流、命令 ID、路径和 CSS 类名。
- [X] T005 [US1] 翻译 `.obsidian/plugins/quickadd/data.json` 中 20 个选项的显示名称，保留每个选项的 `id`、类型、模板路径和命令开关。
- [X] T006 [US1] 翻译 `Meta/views/*.js` 中的标题、提示、表头、空状态和错误信息；将 `Meta/views/setup.js`、`Meta/views/quicklinks.js` 对英文 QuickAdd 名称的判断改为稳定 ID。
- [X] T007 [US1] 翻译 `00 Dashboards/*.md` 的可见正文和标题，保留属性键、Dataview 代码块、wikilink 目标和按钮命令。
- [X] T008 [US1] 对 `.obsidian/plugins/life-os-app/main.js` 与 `Meta/views/*.js` 运行语法检查，并在隔离 Obsidian 仓库中核对 Life OS、Setup 和 Compass Dashboard。

**Checkpoint**: 用户故事 1 可独立展示中文首页及仪表盘。

## Phase 4: User Story 2 - 用中文建立和记录笔记 (Priority: P2)

**Goal**: 模板和提示词生成中文可读内容，原有数据结构与命令持续可用。

**Independent Test**: 在隔离仓库创建日记及一种其他笔记，并检查生成属性和仪表盘汇总。

- [X] T009 [US2] 翻译 `Meta/Compass Config.md` 的问题、习惯、生活领域与说明，保留属性键、前缀、目录和日期格式。
- [X] T010 [US2] 翻译 `Templates/*.md` 的标题、段落提示与用户可见占位内容，保持 Templater 和 QuickAdd 表达式原样有效。
- [X] T011 [US2] 翻译 `Prompts/*.md` 的用户可见说明与指令，逐条保留读取范围、审批条件和写入边界。
- [X] T012 [US2] 同步翻译 `scripts/template/defaults/**/*.md` 中打包时重置的笔记，确保生成仓库不会恢复英文模板文本。
- [X] T013 [US2] 翻译 `01 Journal/**/*.md` 至 `09 Reading/**/*.md` 的随仓库示例笔记与看板正文，保留 `example` 标签、任务语法、引用来源及所有机器属性。
- [X] T014 [US2] 在隔离 Obsidian 仓库中运行日记与项目或人物的创建流程，检查 `Templates/*.md` 的生成结果和 `Meta/views/*.js` 的数据汇总。

**Checkpoint**: 用户故事 2 可独立展示中文笔记生成与有效数据汇总。

## Phase 5: User Story 3 - 按中文指南完成入门 (Priority: P3)

**Goal**: 用户可沿中文说明完成设置、理解示例数据，并保持内部链接可用。

**Independent Test**: 从 README 进入入门、插件、日记与仪表盘指南，按步骤核对目标与现有界面。

- [X] T015 [US3] 翻译 `Guide/*.md` 的正文、标题、表格和步骤，保留外部引用、代码、命令 ID、文件路径及视频来源。
- [X] T016 [US3] 翻译 `README.md`、`AGENTS.md`、`CHANGELOG.md`、`CONTRIBUTING.md`、`CREDITS.md`、`SECURITY.md` 及其他自有根目录说明；保持许可证和第三方声明原文。
- [X] T017 [US3] 翻译 `wiki/*.md` 和 `scripts/RELEASE.md` 的自有说明；保持路由约定、命令与安全限制。
- [X] T018 [US3] 检查 `README.md`、`Guide/*.md`、`Prompts/*.md` 和 `00 Dashboards/*.md` 的内部链接、嵌入、示例标识与术语一致性。

**Checkpoint**: 用户故事 3 可独立支持中文入门与说明查阅。

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 更新 `scripts/build_template.py` 中生成版本说明和按英文标题匹配的文本处理，确保中文候选仓库的完整与精简版本都可构建。
- [X] T020 更新 `scripts/verify_template.py` 中依赖英文占位文案的检查，继续验证模板为初始状态及现有发布安全要求。
- [X] T021 运行 `scripts/locale_audit.py`、`scripts/verify_release_safety.py`、`scripts/verify_template.py` 相关检查与 JavaScript 语法检查，修复明确的遗漏和回归。
- [X] T022 按 `specs/001-simplified-chinese-vault/quickstart.md` 构建隔离候选仓库，并核对打包结果没有个人数据、密钥或被恢复的英文正文。
- [X] T023 在 Obsidian 中实测候选仓库的 Life OS、Setup、仪表盘、捕获菜单和代表性笔记创建，记录实际结果到 `specs/001-simplified-chinese-vault/acceptance.md`。
- [X] T024 按 Spec Kit 收敛流程复核 `specs/001-simplified-chinese-vault/spec.md`、`plan.md`、`tasks.md` 与交付物；剩余缺口追加任务后解决。

## Dependencies & Execution Order

- Setup (T001-T002) → Foundational (T003) → 各用户故事 → 打包与原生验收 (T019-T024)。
- US1、US2、US3 的文件集合不同，可以在基础清单完成后独立实施；T006 依赖 T005 的 QuickAdd 显示名决定。
- T019-T020 在相关正文译完后执行；T021-T023 在所有目标内容完成后执行。

## Parallel Opportunities

- T004 与 T007 修改不同文件，可并行；T005 完成后才能在 T006 中固定 QuickAdd 关联。
- T010、T011、T013 修改不同目录，可并行；T012 需与 T010 的译文对齐。
- T015 与 T017 修改不同目录，可并行；T018 在它们完成后执行。

## Implementation Strategy

先完成可独立试用的中文 Life OS 与仪表盘，再完成笔记生成和中文指南，最后从隔离候选仓库验证完整交付。用户已授权完整汉化，MVP 检查点是过程验证，不是最终交付边界。

## Phase 7: 用户反馈后的中文目录与个人交付包

- [X] T025 [US1] 按 `contracts/directory-migration.md` 迁移首方目录及 `scripts/template/defaults/` 中的对应目录；保持 `F:\Memory layer` 和原英文仓库内容不变。
- [X] T026 [US1] 更新 `.obsidian/`、首方 Life OS、`元数据/视图/`、`元数据/Compass Config.md` 与 `scripts/` 中的路径消费者、生成位置和热键命令路径。
- [X] T027 [US2] 更新 `指南/`、`模板/`、`提示词/`、仪表盘、示例笔记及根目录文档的路径和内部链接；核对所有目标文件仍存在。
- [X] T028 [US3] 收紧 `scripts/build_template.py` 的个人使用包清单，排除 Spec Kit 过程文件、维护者验证脚本和只供开发的说明；更新个人版中的引用及 `scripts/verify_template.py` 的清单检查。
- [X] T029 运行静态路径、JSON、JavaScript、打包与归档验证，从新构建目录审查实际文件清单和敏感信息，记录结果到 `acceptance.md`。
- [X] T030 若能在不增加用户的 Obsidian 仓库列表项的情况下进行原生试用，核对 Life OS、设置清单、仪表盘和代表性创建流程；否则在 `acceptance.md` 明确本轮原生验收未执行。

## Phase 8: Convergence

- [ ] T031 在用户允许打开中文目录候选、且不会留下额外测试仓库列表项时，对 `Compass-zh-CN-personal-v5` 执行 Life OS、设置清单、Compass 仪表盘、日记和项目创建的 Obsidian 原生验收，并将具体观察追加到 `acceptance.md`。完成前保持该版本为候选状态。

## Phase 9: 中文文件名与主分支收敛

- [X] T032 将首方面向用户的英文笔记名迁移到中文，更新链接、模板、QuickAdd、Periodic Notes、Life OS、Dataview 与构建脚本中的路径，并保留机器标识和本机未提交设置。
- [X] T033 修复每日阅读拆分及计划生成器的中文书卷路径，修复设置向导对 Periodic Notes 中文日记模板的检查，并补充个人包检查。
- [X] T034 在隔离 v7 候选中原生检查 Life OS、设置向导、Compass 总览及“开始今天”按钮；记录 ACP 连接限制和设置清单修复前后的观察，并移除临时 Obsidian 仓库列表项。
- [X] T035 构建 v8 完整版和精简版，完成包内检查、SHA256 与逐文件恢复检查；将 v7 已检查的关键运行文件与 v8 逐文件比对。
- [ ] T036 在中文目录迁移后的隔离仓库中重新执行日记和项目创建，并检查精简版的 Obsidian 原生流程。旧 T031 的 v5 对象已由本轮 v8 候选取代，保留旧任务作为历史记录。
- [X] T037 自审并修正提示词输入清单、指南、示例日记与默认任务中的旧英文笔记名，构建 v9 完整版和精简版并核对归档与已试用的关键运行文件。v9 取代 v8 成为最新候选；T036 的原生创建检查继续待办。
