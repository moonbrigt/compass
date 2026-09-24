# Quickstart: 验证简体中文版

## 前提

- Windows 桌面 Obsidian 1.13.7 或更新的兼容版本。
- 当前工作区为 `F:\compass-zh-cn` 的 `zh-CN` 分支。
- 不把用户正在使用的 `F:\compass` 当作测试输出或打包来源。

## 静态检查

在工作区根目录运行：

```powershell
python scripts/locale_audit.py
python scripts/verify_release_safety.py
node --check .obsidian/plugins/life-os-app/main.js
Get-ChildItem 元数据/视图/*.js | ForEach-Object { node --check $_.FullName }
```

预期：没有遗漏的首方可见英文文案、意外标识改动、脚本语法错误或发布安全失败。检查范围和保留规则见 [localization-contract.md](contracts/localization-contract.md)。

## 构建隔离候选仓库

使用一个不存在的输出路径；构建程序会拒绝覆盖已有目录：

```powershell
python scripts/build_template.py --live F:\compass-zh-cn --out F:\compass-zh-cn-candidates --name Compass-zh-CN-personal-v4 --version 1.1.0-zh.9 --zip
```

预期：构建程序调用 `verify_template.py` 成功，输出候选目录、ZIP 及外置 `.sha256` 文件。输出名称必须是未使用过的新名称。不要把含个人笔记或密钥的现用仓库打包。

## Obsidian 原生验收

1. 把候选目录作为另一个仓库打开，启用随附插件并重载。
2. 查看 Life OS 首页、导航、捕获菜单和未连接服务时的状态。
3. 打开 Setup 与 Compass Dashboard，确认清单、图表、空状态显示中文且无脚本错误。
4. 在候选仓库中创建当天日记与一个项目或人物笔记，确认生成提示、属性和仪表盘汇总。
5. 检查 README → 入门指南 → 日记与插件指南的内部链接。

只记录实际观察到的结果；若原生验证未完成，在交付报告中列出具体缺口。
