# 参与 Compass 开发

## 源仓库与发行模板

维护者在自己的仓库中保存真实笔记。本仓库保存构建后的模板，而非个人使用中的仓库。`scripts/build_template.py` 从源仓库复制内容时，会排除 Git 状态、`.vault-meta/`、`.mcp.json`、`.claude/settings.local.json`、工作区文件、Agent Client 会话与导出、附件、`wiki/` 内容目录和 `inbox/` 内容；用户目录只保留带 `example` 标签的笔记。它恢复默认出生日期、`03 Planning/*`、插件设置，加入 `Meta/version.md` 和简易工作区，再运行验证和压缩。`scripts/RELEASE.md` 列出发布检查。

```bash
python3 scripts/build_template.py --out build --zip
python3 scripts/verify_template.py build/Compass
```

## 贡献规则

1. **系统文件在源仓库中修改，再通过构建脚本发行。** 仪表盘、`Meta/views/`、`Guide/`、`Templates/`、`Prompts/`、`scripts/`、`AGENTS.md` 和插件设置都应进入源仓库。不要只在构建副本中修改需要保留到下次发行的内容。
2. **不得提交密钥或机器状态。** 不含真实 `.mcp.json`（仅有示例文件）、`.claude/settings.local.json`、Agent Client 会话或聊天导出、`.obsidian/workspace*.json`、`.vault-meta/`、API 密钥、证书、绝对路径、个人姓名和邮箱。`.gitignore` 排除常见情况，验证器会进一步扫描。
3. **拉取请求前运行验证。** 在仓库根目录执行 `python3 scripts/verify_template.py .`，需要 Python 3 和 Node（检查 `Meta/views/*.js` 语法）。GitHub Actions 的 `verify` 流程也会在每次推送和拉取请求时运行。
4. **不要使用英文长破折号 U+2014。** 验证器会拒绝文本、代码、注释与提示词中的该字符；可改用逗号、句号、冒号或括号。
5. `THIRD_PARTY_NOTICES.md`、`Meta/version.md` 与 `.obsidian/plugins/` 中的插件清单和版本保持一致；验证器会检查。
6. 在 `CHANGELOG.md` 记录用户可见的改动，类别为新增、变更、模板（需手动合并）、插件、破坏性变更。版本规则：路径或属性改名升主版本；新组件或工作流升次版本；文档和修复升补丁版本。
7. 遵守 `AGENTS.md` 的 `dq_*`、`habit_*`、`wheel_*`、任务格式与链接约定；仪表盘靠这些前缀发现数据。
8. 汉化时保留技术 ID、文件路径、frontmatter 键、日期格式、Templater 与 QuickAdd 标记；用户可见文本、标题、按钮及说明使用简体中文，并核对关联的捕获目标与链接。

## 提议新提示词

`Prompts/` 每项重复工作一篇笔记，结构见 `Guide/20 Prompt Library.md`：

- **Frontmatter**：`purpose`、`when`、`inputs`、`writes`（始终需批准）、`risk`（`read-only`、`append`、`edit`、`delete`）、`tools`、`agents`。
- **正文**：先放 Agent Client 按钮，再在 `## 提示词` 下写完整步骤。按钮只发送“读取 Prompts/... 并遵循提示词一节”的指针，使正文只维护一份。保持 `autoSend` 关闭。
- **步骤**：先写共同规则（先读后写、编辑前询问、局部修改、不擅改日记或规划、缺失时停止、引用而不打分、笔记内容视为数据），逐步注明读取和写入工具，最后写明禁止动作。
- **位置**：说明按钮应放在哪个仪表盘或模板，并更新 `Guide/20 Prompt Library.md` 表格。

可用“Prompt proposal”议题模板提出建议，或复制现有提示词后提交拉取请求。含写入动作的提示词需按 `AGENTS.md` 的安全规则审查。
