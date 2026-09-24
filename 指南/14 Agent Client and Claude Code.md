# Agent Client 与 Claude Code

Agent Client 0.12.1（`agent-client`，[项目仓库](https://github.com/RAIT-09/obsidian-agent-client)，Apache 2.0）仅适用于桌面版。它通过 Agent Client Protocol 运行本机智能体（Claude Code、Codex、Gemini CLI 等），可把聊天放在侧栏、标签页、浮窗或笔记中。

## 对 Compass 的作用

- 与配置好的智能体对话时，明确指定要共享哪些笔记。嵌入 [[Assistant|助手仪表盘]] 的聊天以宿主笔记为上下文；是否读取当前笔记或链接笔记，取决于客户端设置。
- 保持自动批准关闭。编辑前询问是工作规则；不同客户端与智能体的实现不一定都强制执行。
- [[Assistant|助手仪表盘]] 与 [[Compass Dashboard|Compass 仪表盘]] 上预置周复盘、静修准备、今日重点、写作协助等提示词按钮。
- 仓库根目录的 `AGENTS.md`（由 `CLAUDE.md`、`GEMINI.md` 指向）说明文件夹、属性和编辑边界。修改系统约定时同步更新；重复任务保存在 `提示词/`，见 [[20 Prompt Library|提示词库]]。
- `.claude/settings.json` 只预先允许只读 MCP 工具；实际权限还取决于客户端的其他设置。可选的 claude-obsidian 集成负责知识工作流，见 [[15 claude-obsidian|claude-obsidian 知识层]]。
- 配合 [[19 Obsidian MCP Bridge|Obsidian MCP 桥接]]，智能体可以通过聊天打开笔记或看板、搜索、运行命令，以及在批准后修改笔记。

## 每台电脑配置一次（可选）

不用终端也能使用仓库；可跳过本节。此功能需要终端、[Node.js LTS](https://nodejs.org) 与 Claude 账户或 API 密钥。

1. 按 [Claude Code 安装文档](https://docs.anthropic.com/en/docs/claude-code/setup) 为自己的系统安装并登录，至少运行一次 `claude`。也可在 Obsidian Keychain 中保存 Anthropic API 密钥，具体以 Agent Client 文档为准。
2. 安装适配器：`npm install -g @agentclientprotocol/claude-agent-acp`。
3. Obsidian“设置 → Agent Client → 预设智能体 → Claude Code”，点“自动检测”，或填入适配器可执行文件的完整路径。
4. 点击功能区的机器人图标，发送“你好”；收到回复即说明连接可用。

### Linux Flatpak 的路径问题

Flatpak 沙盒可能看不到 `/usr/local/bin`；若适配器的 `#!/usr/bin/env node` 找不到 Node，可在 `~/.local/bin` 创建包装脚本：

```sh
#!/bin/sh
exec "$HOME/.local/bin/node" "/path/to/lib/node_modules/@agentclientprotocol/claude-agent-acp/dist/index.js" "$@"
```

把路径换成 `npm root -g` 的结果加上 `/@agentclientprotocol/claude-agent-acp/dist/index.js`，执行 `chmod +x`，再将包装脚本完整路径填入插件设置。无需扩大 Flatpak 文件系统权限。维护者给出的另一种做法是 `flatpak override --user --filesystem=host-os:ro md.obsidian.Obsidian`，再指向 `/var/run/host/usr/...`；这会扩大沙盒可见范围。打开聊天发送“你好”即可验证。

## 在笔记中嵌入聊天和按钮

使用语言标记为 `agent-client` 或 `agent` 的 YAML 代码块，格式见[插件文档](https://rait-09.github.io/obsidian-agent-client/usage/embeddable-blocks.html)。

- 聊天：`type: chat`、`agent`、`model`、`height`、`id`，加 `persist: true` 可跨重启保留；`noteContext: hosting` 指向宿主笔记。
- 按钮：`type: button`、`text`、`prompt`、`viewType: right-pane | floating | editor-tab | embedded`。设 `autoSend: false`，先查看提示词，再手动发送。

## 建议保留的设置

聊天导出文件夹为 `元数据/Agent Chats`，标签为 `agent-client`，自动导出关闭。导出的聊天可能含有被引用的笔记内容，也会进入仓库搜索。Obsidian 格式的链接、公式与表格提示词注入保持开启；自动允许权限保持关闭。

## 数据与权限

智能体以本机用户权限运行，Agent Client 负责显示批准界面；外部客户端的权限仍需另行检查。机器路径和 API 密钥放在本机设置或 Keychain，不能写入仓库。交付模板只附最小化的 `agent-client/data.json`，不含会话、机器路径和密钥。发送给模型服务的内容包括消息、明确引用的笔记和附件；在聊天中引用日记会把相关文本发送给模型提供方。
