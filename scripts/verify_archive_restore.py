#!/usr/bin/env python3
"""Validate a candidate ZIP and restore into a disposable directory only."""
import hashlib
import pathlib
import re
import stat
import sys
import tempfile
import zipfile


def safe_name(name):
    if not name or "\\" in name or ":" in name or any(ord(c) < 32 for c in name):
        return False
    path = pathlib.PurePosixPath(name)
    return not path.is_absolute() and all(part not in (".", "..", "") for part in name.rstrip("/").split("/"))


def verify_archive(archive):
    archive = pathlib.Path(archive)
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    checksum = pathlib.Path(str(archive) + ".sha256").read_text(encoding="utf-8").strip().split("  ", 1)
    if checksum != [digest, archive.name]:
        raise ValueError("Archive checksum mismatch")
    with zipfile.ZipFile(archive) as bundle:
        entries = bundle.infolist()
        if len(entries) > 10000 or sum(item.file_size for item in entries) > 100_000_000:
            raise ValueError("Archive exceeds restore-test bounds")
        names = [item.filename for item in entries]
        if any(not safe_name(name) for name in names) or len(set(name.casefold() for name in names)) != len(names):
            raise ValueError("Unsafe or duplicate archive paths")
        roots = {name.split("/")[0] for name in names}
        if len(roots) != 1:
            raise ValueError("Expected one candidate root")
        for item in entries:
            mode = stat.S_IFMT(item.external_attr >> 16)
            if mode not in (0, stat.S_IFREG, stat.S_IFDIR):
                raise ValueError("Archive contains non-regular entries")
        if bundle.testzip() is not None:
            raise ValueError("Archive CRC mismatch")
        with tempfile.TemporaryDirectory(prefix="life-os-restore-") as target:
            bundle.extractall(target)
            root = pathlib.Path(target, next(iter(roots)))
            manifest = root / "MANIFEST.sha256"
            expected = {}
            for line in manifest.read_text(encoding="utf-8").splitlines():
                match = re.fullmatch(r"([a-f0-9]{64})  (.+)", line)
                if not match or not safe_name(match[2]) or match[2] in expected:
                    raise ValueError("Invalid embedded manifest")
                expected[match[2]] = match[1]
            actual = {file.relative_to(root).as_posix() for file in root.rglob("*") if file.is_file()} - {"MANIFEST.sha256"}
            if actual != set(expected):
                raise ValueError("Restored inventory mismatch")
            for relative, expected_hash in expected.items():
                if hashlib.sha256((root / relative).read_bytes()).hexdigest() != expected_hash:
                    raise ValueError("Restored file checksum mismatch")
    return digest, len(expected)


if __name__ == "__main__":
    try:
        digest, count = verify_archive(sys.argv[1])
        print(f"PASS candidate extraction: {count} restored files match the embedded manifest; SHA256 {digest}")
        print("Disposable restore removed. Personal-vault backup recovery and native app behavior are not tested.")
    except (ValueError, OSError, zipfile.BadZipFile, IndexError) as error:
        print("FAIL archive restore verification:", type(error).__name__)
        sys.exit(1)
