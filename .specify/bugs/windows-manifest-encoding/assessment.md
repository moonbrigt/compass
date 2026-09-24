# Bug Assessment: Windows locale encoding breaks package manifest

- **Slug**: windows-manifest-encoding
- **Created**: 2026-09-24
- **Source**: local sanitized-template build while preparing the Chinese branch for merge
- **Verdict**: valid
- **Severity**: high

## Report

On Windows with `locale.getencoding() == cp936`, `python scripts/build_template.py --out <sibling> --name Compass-merge-check --version 1.1.0-zh.10 --zip` fails in `scripts/verify_template.py:57` with `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xc8`. The builder removes private staging and publishes no archive.

## Symptom

The builder emits a manifest containing Chinese paths in the system's locale encoding, while the verifier requires UTF-8. A build should produce the same UTF-8 manifest on Windows and Linux.

## Reproduction

1. Use a Windows Python interpreter whose locale encoding is cp936.
2. Build the Chinese template into a fresh output directory outside the source tree.
3. The internal verifier raises `UnicodeDecodeError` while reading `MANIFEST.sha256` as UTF-8.

## Suspected Code Paths

- `scripts/build_template.py:344` writes `MANIFEST.sha256` without an explicit encoding.
- `scripts/verify_template.py:56-57` reads that manifest with `encoding="utf-8"`.
- `scripts/verify_archive_restore.py` also expects a valid UTF-8 manifest.

## Root Cause Hypothesis

High confidence. `Path.write_text` defaults to the Windows locale encoding here; the manifest includes Chinese filenames. The verifier decodes it as UTF-8, so bytes encoded as cp936 are invalid. The failure location and source code agree.

## Proposed Remediation

**Preferred**: Write `MANIFEST.sha256` with `encoding="utf-8"`. Keep the manifest format, sorted paths, and byte hashes unchanged. The external `.sha256` contains only ASCII and does not need a format change.

**Files likely to change**:

- `scripts/build_template.py`

**Tests to add or update**:

- Re-run the exact full build on this Windows locale, then verify the candidate and archive restore.
- Confirm the emitted manifest decodes as UTF-8 and contains Chinese paths.

## Risks & Considerations

- Existing manifests from earlier local builds may use locale encoding; rebuild a fresh candidate rather than rewriting old archives.
- Do not stage live Obsidian runtime settings or private keys.

## Open Questions

None.
