# Bug Verification: Assistant buttons cannot find an offscreen embedded chat

- **Slug**: assistant-embedded-chat-not-found
- **Tested**: 2026-09-24
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The original “开始今天” click no longer produces the embedded-chat notice. In Obsidian 1.13.7, it opened a right-pane chat and placed the Morning Start prompt in the input without sending it. Agent connection and provider response were not verified.

## Checks Performed

| Check | Command / Action | Result | Notes |
| --- | --- | --- | --- |
| Original reproduction after fix | Open usage-vault Assistant near the top and click “开始今天” | pass | Right-pane chat opened; `提示词/01 Morning Start.md` prompt appeared in the input; no embedded-chat notice. |
| Button contract in source | `node scripts/verify_assistant_contracts.mjs .` | pass | All 16 routes, manual send, and prompt paths checked. |
| Button contract in usage vault | `node scripts/verify_assistant_contracts.mjs 'F:\Compass 中文版'` | pass | Synced note passed the same checks. |
| Script syntax | `node --check scripts/verify_assistant_contracts.mjs` | pass | No syntax errors. |
| Diff whitespace | `git diff --check -- '00 仪表盘/Assistant.md' 'scripts/verify_assistant_contracts.mjs'` | pass | Only line-ending conversion warnings. |
| Source-to-usage synchronization | SHA256 of both `Assistant.md` files | pass | Both equal `A1D095EB044A1A678EE27045E412660524C2F76B1631EBAD27AD4F2AC72977BE`. |

## Output Excerpts

- Contract verifier: `助手契约通过：16 项工作流均关闭自动发送，提示词路径存在，且说明了上下文与批准边界；未测试原生客户端行为。`
- Native check: the right-pane input held `请用 vault_read 阅读 提示词/01 Morning Start.md ...` and showed a send button. No message was submitted.

## Residual Risks

- The right-pane chat showed `Connecting to Codex...`; no ACP session or provider response was established during this check.
- The separately observed embedded Claude Code chat reported `ACP connection closed` before the fix. This routing change does not repair local agent configuration.
- Only the “开始今天” button was clicked natively after the fix; the shared route and `autoSend` settings of all 16 buttons passed the static contract check.

## Recommendation

Close this routing bug. Investigate ACP connection failures separately if the user needs an agent response from either chat view.
