# Bug Assessment: Assistant buttons cannot find an offscreen embedded chat

- **Slug**: assistant-embedded-chat-not-found
- **Created**: 2026-09-24
- **Source**: user report and local Obsidian reproduction
- **Verdict**: valid
- **Severity**: medium

## Report

In `F:\Compass 中文版\00 仪表盘\Assistant.md`, clicking “开始今天” shows `[Agent Client] No embedded chat block found in this note.` The `agent-client` chat block exists at line 138. The source and usage copies have the same SHA256 hash.

## Symptom

Buttons at the top of Assistant cannot route prompts to the chat block near the end of the note when that block has not been rendered. The expected behavior is to prepare the prompt without sending it.

## Reproduction

1. Open `Assistant.md` near the top in Obsidian 1.13.7 with Agent Client 0.12.1.
2. Click “开始今天”; the reported notice appears, and no prompt opens.
3. Scroll to the end until the embedded chat renders. Click a nearby system button; its prompt appears in the chat input without being sent.

The embedded chat separately displayed `Session Creation Failed: ACP connection closed` on this machine. That connection failure is outside this routing defect.

## Suspected Code Paths

- `00 仪表盘/Assistant.md`: all 16 buttons use `viewType: embed`, while the only `agent-client` chat block is near the end of the note.
- `.obsidian/plugins/agent-client/main.js`: `findNearestEmbeddedChat` searches only the current `viewRegistry` entries; `runPromptInChat` shows the notice when none is found.
- `.obsidian/plugins/agent-client/main.js`: embedded chat views register when their Markdown code block renders and unregister when it unloads.
- `scripts/verify_assistant_contracts.mjs`: the existing contract checks prompt paths and `autoSend`, but does not check the routing mode.

## Root Cause Hypothesis

High confidence. Obsidian has not rendered the offscreen chat block when a top button is clicked, so Agent Client has no embedded chat view registered for this note. The error disappears for a button adjacent to the rendered chat, and its prompt reaches that chat input.

## Proposed Remediation

**Preferred**: Change all 16 Assistant buttons to `viewType: right-pane` so a button opens a chat view and prepares its prompt without depending on an offscreen block. Keep `autoSend: false` and the standalone embedded chat. Update Assistant's context explanation to distinguish the two chat views. Add a routing assertion to the existing assistant contract verifier.

**Files likely to change**:

- `00 仪表盘/Assistant.md`
- `scripts/verify_assistant_contracts.mjs`
- `F:\Compass 中文版\00 仪表盘\Assistant.md` (synchronized usage copy)

**Tests to add or update**:

- Run the assistant contract verifier and assert all 16 buttons route to `right-pane` with `autoSend: false`.
- Reopen Assistant near the top in the usage vault, click “开始今天”, and confirm the prompt is prepared without the embedded-chat notice or automatic send.

## Risks & Considerations

- A button now opens a right-pane chat; its note context depends on Agent Client settings rather than the embedded block's `noteContext: hosting`.
- Agent connection is a separate local prerequisite; routing can be verified without claiming a successful ACP session or provider response.
- Preserve local `.obsidian` settings and the user's other workspace data.

## Open Questions

None for this routing fix.
