# Bug Fix: Windows CRLF hides assistant workflows from verifier

- **Slug**: windows-crlf-assistant-check
- **Fixed**: 2026-09-24
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Normalize `Assistant.md` line endings in memory before checking agent blocks. The Markdown and existing contract assertions are unchanged.

## Changes

| File | Change | Notes |
| --- | --- | --- |
| `scripts/verify_assistant_contracts.mjs` | modified | Converts CRLF and lone CR to LF after reading the source. |

## Tests Added or Updated

No persistent test fixture was added. The existing verifier was run against disposable LF and CRLF copies of the same 16-workflow source, each with its referenced prompt files.

## Local Verification

- `node scripts/verify_assistant_contracts.mjs .` → 16 workflows passed.
- `node --check scripts/verify_assistant_contracts.mjs` → passed.
- Disposable LF fixture → exit 0, 16 prompts found.
- Disposable CRLF fixture → exit 0, 16 prompts found.

## Deviations from Assessment

None.

## Follow-ups

Run the complete release checks on a clean checkout before merging `zh-CN` into `main`.
