# Bug Assessment: Windows CRLF hides assistant workflows from verifier

- **Slug**: windows-crlf-assistant-check
- **Created**: 2026-09-24
- **Source**: local release verification while preparing the Chinese branch for merge
- **Verdict**: valid
- **Severity**: high

## Report

On a clean Windows worktree at `origin/zh-CN`, `node scripts/verify_assistant_contracts.mjs .` fails with `All 16 assistant workflows must remain available` and `0 !== 16`. The same `00 仪表盘/Assistant.md` contains 16 `agent` button blocks.

## Symptom

The release verifier reports zero assistant workflows on Windows even though all 16 blocks are present. It should validate the blocks with either LF or CRLF checkout line endings.

## Reproduction

1. Check out `origin/zh-CN` on Windows with CRLF conversion enabled.
2. Confirm `00 仪表盘/Assistant.md` contains 145 CRLF sequences and 16 `agent` button blocks.
3. Run `node scripts/verify_assistant_contracts.mjs .`; it fails with `0 !== 16`.

## Suspected Code Paths

- `scripts/verify_assistant_contracts.mjs:8` reads Markdown without newline normalization.
- `scripts/verify_assistant_contracts.mjs:9` matches only `` ```agent\n ``, so it does not match `` ```agent\r\n ``.
- Subsequent line-anchored assertions also assume LF-only content.

## Root Cause Hypothesis

High confidence. Windows Git checkout converted the Markdown to CRLF, while the script's regular expressions require LF. Byte inspection and the exact failing assertion support this diagnosis.

## Proposed Remediation

**Preferred**: Normalize the source text to LF in memory immediately after reading it. Keep the existing block, permission, path, and boundary assertions unchanged. Do not rewrite the Markdown file.

**Files likely to change**:

- `scripts/verify_assistant_contracts.mjs`

**Tests to add or update**:

- Exercise the existing verifier against both CRLF and LF copies of the same 16-workflow source in a disposable directory.
- Run the release contract checks on the repaired source.

## Risks & Considerations

- In-memory newline normalization should preserve the actual Markdown and prompt text; verify both newline variants produce the same result.
- Do not stage local Obsidian runtime settings or API keys while committing the fix.

## Open Questions

None.
