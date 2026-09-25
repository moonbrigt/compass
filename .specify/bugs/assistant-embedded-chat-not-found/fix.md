# Bug Fix: Assistant buttons cannot find an offscreen embedded chat

- **Slug**: assistant-embedded-chat-not-found
- **Fixed**: 2026-09-24
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

All 16 Assistant buttons now open a right-pane chat and prepare their prompt there. This removes the dependency on the offscreen embedded chat block while keeping manual sending and the standalone embedded chat.

## Changes

| File | Change | Notes |
| --- | --- | --- |
| `00 仪表盘/Assistant.md` | modified | Changed 16 button routes from `embed` to `right-pane` and corrected the context explanation. |
| `scripts/verify_assistant_contracts.mjs` | modified | Asserts the route on every Assistant button. |
| `F:\Compass 中文版\00 仪表盘\Assistant.md` | synchronized | Byte-identical to the source copy after the change. |

## Tests Added or Updated

- `scripts/verify_assistant_contracts.mjs` now rejects any Assistant button without `viewType: right-pane`; its existing checks still require `autoSend: false` and valid local prompt paths.

## Local Verification

- `node scripts/verify_assistant_contracts.mjs .` — passed for all 16 workflows.
- `node scripts/verify_assistant_contracts.mjs 'F:\Compass 中文版'` — passed for all 16 workflows.
- `node --check scripts/verify_assistant_contracts.mjs` — passed.
- `git diff --check -- '00 仪表盘/Assistant.md' 'scripts/verify_assistant_contracts.mjs'` — passed; Git only reported line-ending conversion warnings.
- Source and usage `Assistant.md` SHA256: `A1D095EB044A1A678EE27045E412660524C2F76B1631EBAD27AD4F2AC72977BE`.

## Deviations from Assessment

None.

## Follow-ups

Recheck the original button flow in Obsidian and record the result in `test.md`. The observed `ACP connection closed` error is a separate local agent configuration issue.
