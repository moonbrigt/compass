# Bug Verification: Windows locale encoding breaks package manifest

- **Slug**: windows-manifest-encoding
- **Tested**: 2026-09-24
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The cp936 build failure no longer reproduces. The clean candidate passes its template checks and its ZIP restores with the exact expected file inventory and hashes.

## Checks Performed

| Check | Command / Action | Result | Notes |
| --- | --- | --- | --- |
| Original reproduction | Build a fresh Chinese candidate on Windows cp936 | pass | 200 passed, 0 failed. |
| Chinese hotkey | Inspect sanitized copy after `copy_tree` | pass | Daily and Chinese Templater hotkeys both retained. |
| Safety regression | `python scripts/verify_release_safety.py` | pass | 11 tests. |
| Archive restore | `python scripts/verify_archive_restore.py <fresh ZIP>` | pass | 195 files matched manifest; SHA256 checked. |
| Manifest encoding | Decode embedded manifest as UTF-8 | pass | 195 lines, including Chinese paths. |

## Output Excerpts

`200 passed, 0 failed`; `PASS candidate extraction: 195 restored files match the embedded manifest`.

## Residual Risks

This verifies packaging and local extraction. It does not establish native Obsidian behavior, mobile support, provider connectivity, or personal backup recovery.

## Recommendation

Close this packaging bug. Keep the resulting package at candidate status until native acceptance is completed.
