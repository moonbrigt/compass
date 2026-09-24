通过 Agent Client 在仓库内使用已配置的代理。工作流要求代理遵守 `AGENTS.md`，这是一项使用规则，不能保证每个客户端都会请求批准。请检查所用客户端已关闭自动批准。设置方法见 [[14 Agent Client and Claude Code|Agent Client 与 Claude Code]]。没有该插件时，可阅读 `提示词/` 中的笔记，并把“提示词”部分复制给你使用的代理（见 [[20 Prompt Library|提示词库]]）。

## 发送前检查

下方按钮会准备提示词，且已关闭自动发送。发送前请在输入框中检查内容。嵌入式聊天会使用当前的 Assistant 笔记作为上下文，并不保证自动包含你上次查看的其他笔记。

- 检查所选代理、提及的笔记、附件和关联笔记的展开设置。
- 如果对话使用外部服务，提示词及已包含或后续检索到的笔记可能发送给该服务。日记和人物关系笔记可能含有敏感个人信息。
- 进行大范围复盘前，先让代理列出拟读取的笔记路径和日期范围；确认这些上下文后再继续。
- 同意读取上下文，不等于同意编辑、安装、付费或发布。
- 代理已配置或本地 API 密钥已存在，不代表认证、连接或整个工作流已通过实测。

首方 Life OS 仪表盘不会直接请求外部服务。下方按钮会将任务交给 Agent Client；实际行为取决于其设置、外部客户端和所选代理。

## 每日
```agent
type: button
text: "开始今天"
prompt: "请用 vault_read 阅读 提示词/01 Morning Start.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "引导我完成今晚的每日问题"
prompt: "请用 vault_read 阅读 提示词/02 End of Day Coaching.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "今日要事"
prompt: "请用 vault_read 阅读 提示词/14 What Matters Today.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```

## 每周与每季度
```agent
type: button
text: "复盘本周"
prompt: "请用 vault_read 阅读 提示词/03 Weekly Review.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "准备个人静修"
prompt: "请用 vault_read 阅读 提示词/04 Retreat Prep.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "引导本次个人静修"
prompt: "请用 vault_read 阅读 提示词/05 Retreat Facilitation.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "分析每日问题与习惯趋势"
prompt: "请用 vault_read 阅读 提示词/13 Trend Analysis.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```

## 工作
```agent
type: button
text: "整理收件箱任务"
prompt: "请用 vault_read 阅读 提示词/06 Task Triage.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "准备这次会面"
prompt: "请用 vault_read 阅读 提示词/07 Meeting Prep.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "启动这个项目"
prompt: "请用 vault_read 阅读 提示词/08 Project Kickoff.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "整理看板"
prompt: "请用 vault_read 阅读 提示词/09 Board Grooming.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```

## 写作与研究
```agent
type: button
text: "推进这篇作品"
prompt: "请用 vault_read 阅读 提示词/10 Writing Pipeline.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "发布前 SEO 检查"
prompt: "请用 vault_read 阅读 提示词/11 SEO Pre-publish Audit.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "将此页面归档到知识库"
prompt: "请用 vault_read 阅读 提示词/12 Research Capture.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```

## 系统
```agent
type: button
text: "检查仓库健康状况"
prompt: "请用 vault_read 阅读 提示词/15 Vault Health Check.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```
```agent
type: button
text: "帮我设置这个仓库"
prompt: "请用 vault_read 阅读 提示词/16 Onboarding Assistant.md，并针对当前打开的笔记执行其中的“## 提示词”部分；如果当前笔记不适用，则使用当前时间段。"
viewType: embed
autoSend: false
```

## 聊天
```agent-client
type: chat
agent: claude-code-acp
height: 600px
id: lifeos-assistant
persist: true
noteContext: hosting
```
