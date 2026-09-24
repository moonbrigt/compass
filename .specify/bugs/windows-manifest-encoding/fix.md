# Bug Fix: Windows locale encoding breaks package manifest

- **Slug**: windows-manifest-encoding
- **Fixed**: 2026-09-24
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Make the Chinese template build and archive verification use UTF-8 for text that contains translated paths and identifiers. This prevents cp936 from corrupting the embedded manifest or silently dropping a translated hotkey.

## Changes

| File | Change | Notes |
| --- | --- | --- |
| `scripts/build_template.py` | modified | Read source JSON as UTF-8 and write `MANIFEST.sha256` as UTF-8. |
| `scripts/verify_archive_restore.py` | modified | Read both checksum and embedded manifest as UTF-8. |

## Tests Added or Updated

No persistent fixture was added. The existing sanitizer, template verifier, and archive restore checks were run on a fresh candidate under a cp936 Windows locale; the output includes Chinese paths and a Chinese Templater hotkey key.

## Local Verification

- `locale.getencoding()` → `cp936`.
- Fresh `build_template.py --zip` → 200 checks passed, 0 failed; candidate and archive written.
- `verify_release_safety.py` → 11 tests passed.
- `verify_archive_restore.py` → 195 files restored and matched the embedded manifest.
- Embedded manifest decoded as UTF-8 and contained Chinese paths.

## Deviations from Assessment

The first retest exposed two more locale-dependent text reads in the same release path: source `hotkeys.json` was decoded with cp936, removing the Chinese Templater shortcut, and archive restore decoded the UTF-8 manifest with cp936. The fix was expanded to those reads and to `scripts/verify_archive_restore.py`. The original packaging and verification contracts remain unchanged.

## Follow-ups

Perform native Obsidian acceptance before promoting the candidate to a formal release.
