# Obsidian MCP 桥接

Claude 可在 Obsidian 的聊天面板或终端中通过 MCP 操作应用：打开笔记、切换看板、运行命令、搜索与编辑。无需额外插件；Local REST API 5.x 在 `http://127.0.0.1:27123/mcp` 提供 MCP 服务，使用本机生成的同一个 API 密钥认证。

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

- Codex 可在 `~/.codex/config.toml` 中设置 `[mcp_servers.obsidian]`，URL 为 `http://127.0.0.1:27123/mcp`，bearer 密钥从环境变量读取。字段名按当前 Codex 文档核对。
- Gemini CLI 可在 `~/.gemini/settings.json` 中配置 `mcpServers`、`httpUrl` 与 `Authorization: Bearer <key>` 请求头；字段名按当前 Gemini CLI 文档核对。
- 在仓库内运行时，Codex 保留默认批准模式，Gemini CLI 不启用自动批准；`AGENTS.md` 的“编辑前询问”是最低行为要求。
- `.claude/settings.json` 仅预先允许 `vault_read`、`vault_list`、`vault_get_document_map`、`search_*`、`tag_list`、`active_file_get_path`、`command_list`、`open_file` 等只读工具；写入和执行命令仍需批准。

## 每台电脑设置一次（可选）

若不用终端可跳过；Agent Client 聊天仍可使用，但无法自行打开笔记或运行 Obsidian 命令。

1. 确认 Local REST API 的 HTTP 服务运行于 27123。
2. 在用户范围注册 Claude Code 的服务，密钥只保存在仓库外：

   ```bash
   claude mcp add --scope user --transport http obsidian http://127.0.0.1:27123/mcp \
     --header "Authorization: Bearer <key from Settings → Local REST API>"
   claude mcp list
   ```

   仓库根目录的 `.mcp.example.json` 给出了其他 MCP 客户端的示例。不要在仓库里创建带真实密钥的 `.mcp.json`；该文件已被 `.gitignore` 排除。

3. 在 Obsidian 的 Agent Client 聊天菜单中重启智能体，或开新聊天，让 Claude Code 读取新的服务配置。ACP 适配器读取与 CLI 相同的用户、项目和本地设置。
4. 在聊天中要求“打开项目看板”或“运行每日问题命令”；首次应看到 `obsidian` 工具调用与权限提示。

## 多个会话与权限

[[智能助手|助手仪表盘]] 的聊天面板与终端 `claude` 是不同进程；二者通过同一个 Obsidian MCP 服务访问仓库。需要交接时，把内容写进笔记（例如 `wiki/hot.md` 或日记），另一会话再读取。Compass 不需要实时转发两个会话之间的消息。

只监听本机地址；密钥授予仓库访问权。Agent Client 中保持自动批准关闭，其他客户端也应分别检查权限。API 本身不会执行“写入前询问”规则。默认情况下 `vault_delete` 移到回收站；`vault_write` 会替换整篇文件，优先使用 `vault_patch` 或 `vault_append`。具体可编辑范围以根目录 `AGENTS.md` 为准。
