# claude-obsidian 知识层

[claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) 是模板作者开发的 Claude Code 插件，负责知识整理与来源追踪。它提供 `/save`、`/wiki-query`、`/wiki-ingest`、`/wiki-lint`、`/autoresearch`、`/think`、`/canvas` 等工作流，以及 Bases、Markdown 参考资料。其事务流程先规划并展示哈希，再经批准写入。

它不负责运行 Compass。事务核心只写入 `wiki/` 与 `.raw/`；日记、静修、任务、人物和写作仍在 Obsidian 中用 QuickAdd、Templater、Tasks、Kanban，或经 Agent Client 逐次批准后修改，见 [[14 Agent Client 与 Claude Code|Agent Client 与 Claude Code]]。两层都读取仓库根目录的 `CLAUDE.md`。

## 文件与目录

| 路径 | 用途 |
| --- | --- |
| `.claude-obsidian.json` | 工作区标记，含 `role: vault`、`source_inbox: inbox` |
| `.gitignore` | 忽略 `.vault-meta/`、`.mcp.json`、`.obsidian/workspace*.json`、`.trash/` |
| `inbox/` | 待摄入的资料 |
| `.raw/.manifest.json` | 摄入差异记录 |
| `wiki/overview.md`、`wiki/hot.md`、`wiki/index.md`、`wiki/log.md` | 概览、近期上下文、索引、操作日志 |
| `wiki/routing-map.md` | 仓库作者定义的归档位置 |
| `wiki/meta/ledgers/*.json` | 来源与论断台账，初始为空 |
| `.obsidian/snippets/vault-colors.css` | 为文件树中的 `wiki/*` 着色，已启用 |
| `.vault-meta/` | 运行日志，已被 Git 忽略；发布前删除 |

仪表盘的全仓库任务查询会排除 `wiki/`，因此 wiki 清单不会混入任务或项目看板。

## 命令

```bash
CORE=<claude plugin cache>/claude-obsidian/<version>/scripts/claude-obsidian.py
python3 "$CORE" doctor --vault .
python3 "$CORE" lint --vault . --format markdown
```

第一条指定插件脚本路径；也可直接使用 `/claude-obsidian:*` 命令。在 Claude Code（终端或 Agent Client）中可运行 `/claude-obsidian:wiki-query`、`/claude-obsidian:save`、`/claude-obsidian:wiki-lint`。写入依次经过检查、批准、应用；不要使用 `--force`。

可选环境变量 `CLAUDE_OBSIDIAN_SESSION_CONTEXT=1` 会让每次 Claude Code 会话开始时读取 `wiki/hot.md`，也就是把仓库文本加入模型上下文；只在你明确需要时开启。

未安装此插件也不会影响 Compass。此时 `wiki/` 与 `inbox/` 仍是普通 Markdown 文件夹，只是没有对应的斜杠命令。
