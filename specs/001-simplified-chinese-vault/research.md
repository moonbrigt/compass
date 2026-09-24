# Research: Compass 简体中文版

## 决策 1：保留规范化文件名和机器标识

**Decision**: 保留文件与目录路径、属性键、标签、QuickAdd 命令 ID、模板表达式和内部链接目标；翻译标题、说明、占位提示和显示名称。

**Rationale**: Life OS、DataviewJS、QuickAdd 和打包脚本都以这些标识定位内容。改名需要同步迁移多处配置，并会影响已有使用仓库之后的数据移入。

**Alternatives considered**: 全部重命名文件和属性。该方案会扩大迁移范围并降低与上游的可合并性。

## 决策 2：直接处理首方可读插件

**Decision**: 在首方 `life-os-app/main.js` 中翻译显示字符串和必要的提示文本，并保持控制流、命令 ID、CSS 类名和数据路径不变；翻译首方 manifest 的描述。第三方插件文件不修改。

**Rationale**: 仓库包含格式化的首方 CommonJS 实现，没有单独的源码构建工程。修改该文件可直接被 Obsidian 加载，并可逐行审阅和做语法检查。

**Alternatives considered**: 在 DOM 上覆盖译文或另写插件拦截显示。此法依赖界面结构，易漏掉错误与状态文本，也增加运行时复杂度。

## 决策 3：翻译所有生成来源

**Decision**: 同步翻译当前模板、`scripts/template/defaults/` 的重置副本、QuickAdd 显示名和打包脚本生成的版本说明；将依赖英文占位文案的检查改为针对中文模板或稳定属性。

**Rationale**: 只翻译当前笔记会在打包或新建笔记时重新出现英文；现有 `verify_template.py` 对英文占位内容有硬编码判断。

**Alternatives considered**: 只改现有仓库正文。该方案无法交付可持续使用的中文版。

## 决策 4：把翻译检查分为静态与原生两层

**Decision**: 静态层检查标识、链接、JSON、JavaScript 语法、发布安全和翻译遗漏；原生层从隔离候选仓库打开 Obsidian 检查 Life OS、Setup、仪表盘和代表性笔记创建。

**Rationale**: 脚本通过不能证明插件加载或 DataviewJS 渲染，原生界面通过也不能证明密钥和打包安全。

**Alternatives considered**: 仅人工目测。它容易漏掉路径和配置回归。
