# Bug Verification: Windows CRLF hides assistant workflows from verifier

- **Slug**: windows-crlf-assistant-check
- **Tested**: 2026-09-24
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The original Windows CRLF failure no longer reproduces. Both LF and CRLF copies of the 16-workflow source pass the same verifier.

## Checks Performed

| Check | Command / Action | Result | Notes |
| --- | --- | --- | --- |
| Original reproduction | Run the updated verifier against a CRLF copy in a disposable directory | pass | 16 prompt paths present; exit 0. |
| LF behavior | Run against an LF copy of the same source | pass | Exit 0. |
| Source checkout | `node scripts/verify_assistant_contracts.mjs .` | pass | 16 workflows; automatic sending remains disabled. |
| Syntax | `node --check scripts/verify_assistant_contracts.mjs` | pass | No syntax error. |

## Output Excerpts

Both newline variants: `16 项工作流均关闭自动发送，提示词路径存在`.

## Residual Risks

These checks validate the source contract, not an actual AI provider session.

## Recommendation

Close this verifier bug. Keep native Obsidian behavior and provider connection claims separate from the contract result.
