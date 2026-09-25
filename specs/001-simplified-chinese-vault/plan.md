# Implementation Plan: Compass 简体中文版

**Branch**: `main` | **Date**: 2026-09-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-simplified-chinese-vault/spec.md`

## Summary

在 `main` 上维护 Compass 中文版。首方内容目录和用户可见笔记文件名改为中文，并迁移全部路径消费者；保留数据键、命令 ID、日期格式与第三方插件。个人使用版排除开发过程与维护者验证文件，从隔离构建产物进行 Obsidian 实测。

## Technical Context

**Language/Version**: JavaScript (Obsidian 1.13.7 和 DataviewJS), Python 3.12, Markdown/YAML

**Primary Dependencies**: 随仓库附带的 Life OS 0.20.0、Dataview、Templater、QuickAdd、Periodic Notes 等插件；不新增运行时依赖

**Storage**: 本地 Obsidian 仓库中的 Markdown、属性与插件配置

**Testing**: JavaScript 语法检查、原仓库的发布验证脚本、路径与标识审计、隔离候选仓库中的 Obsidian 原生检查

**Target Platform**: Windows 桌面 Obsidian 1.13.7；其他平台仅做静态兼容性检查

**Project Type**: Obsidian 仓库模板，含首方 CommonJS 插件与 DataviewJS 视图

**Performance Goals**: 翻译不增加网络请求、扫描轮次或重复数据存储；主要界面加载维持原版行为

**Constraints**: 不复制正在使用的个人仓库笔记；不改第三方插件二进制或许可证；保留机器标识并迁移首方目录及文件的全部路径引用；不提交密钥

**Scale/Scope**: 仓库约 100 个可翻译 Markdown 文件、9 个仪表盘视图脚本、20 个 QuickAdd 选项和一个约 116 KB 的首方 Life OS 插件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Result |
| --- | --- | --- |
| Markdown is the source of truth | 保留属性、命令、模板和链接契约 | 通过；契约见 `contracts/localization-contract.md` |
| Personal data stays under user control | 源码提交只含模板数据 | 通过；使用仓库的私人记录不进入提交 |
| Runtime compatibility comes before presentation | 首方插件改动可静态检查，第三方二进制不改 | 通过；原生验收见 `quickstart.md` |
| Chinese copy is complete and consistent | 建立术语表与覆盖清单 | 通过；遗漏要在收敛阶段列为任务 |
| Claims follow observed evidence | 区分静态验证与 Obsidian 实测 | 通过；验收步骤见 `quickstart.md` |

## Project Structure

### Documentation (this feature)

```text
specs/001-simplified-chinese-vault/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/localization-contract.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
.obsidian/plugins/life-os-app/main.js       # 首方 UI 文案
.obsidian/plugins/life-os-app/manifest.json # 首方插件简介
.obsidian/plugins/quickadd/data.json        # 捕获命令显示名，保留 id
元数据/视图/*.js                             # 仪表盘显示文案与状态判断
元数据/Compass 配置.md                     # 问题、习惯、领域的显示名
00 仪表盘/*.md                         # 仪表盘与 Setup 页面
模板/*.md                             # 新建笔记模板
提示词/*.md                               # AI 提示词
指南/*.md                                 # 入门与工作流指南
01 日记/ ... 09 阅读/                # 仓库自带示例内容
wiki/*.md, README.md, *.md                 # 自有说明与入口
scripts/template/defaults/**/*.md         # 打包时恢复的默认笔记
scripts/build_template.py                  # 打包文本替换
scripts/verify_template.py                # 依赖占位文案的验收
scripts/locale_audit.py                    # 翻译覆盖与技术标识审计
```

**Structure Decision**: 原有仓库就是可运行模板；在 `main` 迁移首方文件名与所有路径消费者，不另建一套平行笔记或运行时数据库。旧版本可从 Git 历史查看。

## Design Sequence

1. 从原仓库建立可翻译文本清单和简体中文术语表，标出保留的技术字符串。
2. 翻译 Life OS 与仪表盘脚本；把依赖英文显示名的状态检测改为稳定 ID 检测。
3. 翻译 QuickAdd 显示名、配置文本、模板、仪表盘笔记和打包默认文件。
4. 翻译提示词、指南、README、示例笔记及其他自有说明；保留链接和代码块。
5. 更新打包与验证脚本中的英文占位文案判断，运行静态检查并修复问题。
6. 从中文版构建隔离候选仓库，用 Obsidian 打开并验证首页、Setup、仪表盘和代表性笔记创建流程。

## Post-Design Constitution Check

五项原则仍满足：本方案仅翻译首方文案；数据与命令契约列入检查；测试候选仓库与用户现用仓库隔离；无新依赖或自动上传；原生验收结果单独记录。
