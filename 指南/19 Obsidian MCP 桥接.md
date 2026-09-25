# Obsidian MCP 桥接

支持 MCP 的客户端可通过 MCP 操作正在运行的 Obsidian：打开笔记、切换看板、运行命令、搜索与编辑。无需额外插件；Local REST API 5.x 在 `http://127.0.0.1:27123/mcp/` 提供 MCP 服务，使用本机生成的同一个 API 密钥认证。

## 16 个工具

| 工具 | 用途 |
| --- | --- |
| `open_file` | 在界面中打开笔记、看板、仪表盘或今日日记 |
| `command_list`、`command_execute` | 按 ID 查询或运行 Obsidian 命令：QuickAdd 捕获（`quickadd:choice:lifeos-journal`）、Kanban、Periodic Notes／`quickadd:choice:lifeos-daily`、Templater、SEO、`app:reload` 和工作区切换 |
| `active_file_get_path` | 获取当前显示文件的路径 |
| `vault_list`、`vault_read`、`vault_get_document_map` | 浏览目录、读取笔记或单个段落 |
| `vault_write`、`vault_append`、`vault_patch`、`vault_move`、`vault_copy`、`vault_delete` | 写入、追加、局部修改、移动、复制或删除 |
| `search_simple`、`search_query`、`tag_list` | 文本搜索、JsonLogic 元数据查询及标签列表 |

看板是 Markdown。把卡片移到“进行中”可对看板文件运行 `vault_patch`；Obsidian 会重新渲染 Kanban 视图。

## 其他智能体

- Codex 可在仓库的 `.codex/config.toml` 中设置 `[mcp_servers.obsidian]`，URL 为 `http://127.0.0.1:27123/mcp/`，并用 `bearer_token_env_var = "COMPASS_OBSIDIAN_MCP_KEY"` 读取 bearer 密钥；`default_tools_approval_mode = "writes"` 对写入类工具要求批准。
- Claude Code 可将仓库的 `.mcp.example.json` 复制为 `.mcp.json`；示例通过 `Authorization: Bearer ${COMPASS_OBSIDIAN_MCP_KEY}` 认证。`.mcp.json` 已被 `.gitignore` 排除。
- Gemini CLI 可在仓库的 `.gemini/settings.json` 中配置 `mcpServers.obsidian.httpUrl` 和同一认证头，保持 `trust: false`。
- 其他支持 Streamable HTTP 的客户端按 `.mcp.example.json` 的地址与认证头配置。连接必须由客户端加载；仓库说明无法替未知客户端安装 MCP 工具。`AGENTS.md` 的“编辑前询问”适用于所有客户端。
- `.claude/settings.json` 仅预先允许 `vault_read`、`vault_list`、`vault_get_document_map`、`search_*`、`tag_list`、`active_file_get_path`、`command_list`、`open_file` 等只读工具；写入和执行命令仍需批准。

## 每台电脑设置一次

1. 在 Obsidian“设置 → Local REST API”确认未加密 HTTP 服务运行于 27123，并将插件生成的 API 密钥保存为当前用户的 `COMPASS_OBSIDIAN_MCP_KEY` 环境变量。不要把密钥填入仓库文件。
2. 按上节创建所用客户端的仓库级配置。Claude Code 用 `.mcp.example.json` 生成 `.mcp.json`；Codex 和 Gemini CLI 按上节的字段配置。没有电脑操控工具的智能体也能通过 MCP 访问 Obsidian。
3. 重启已启动的 Obsidian 和 Agent 客户端，或在 Agent Client 中开新聊天，让新进程读取环境变量和项目配置。Codex 用 `codex mcp list`、Claude Code 用 `claude mcp list`、Gemini CLI 用 `/mcp` 检查连接；再调用只读的 `vault_list` 或 `active_file_get_path` 验证。

## 多个会话与权限

[[智能助手|助手仪表盘]] 的聊天面板与终端 `claude` 是不同进程；二者通过同一个 Obsidian MCP 服务访问仓库。需要交接时，把内容写进笔记（例如 `wiki/hot.md` 或日记），另一会话再读取。Compass 不需要实时转发两个会话之间的消息。

只监听本机地址；密钥授予仓库访问权。Agent Client 中保持自动批准关闭，其他客户端也应分别检查权限。API 本身不会执行“写入前询问”规则。默认情况下 `vault_delete` 移到回收站；`vault_write` 会替换整篇文件，优先使用 `vault_patch` 或 `vault_append`。具体可编辑范围以根目录 `AGENTS.md` 为准。
