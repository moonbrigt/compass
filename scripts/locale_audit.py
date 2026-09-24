#!/usr/bin/env python3
"""Audit zh-CN coverage and stable Compass vault identifiers.

Run from anywhere: python scripts/locale_audit.py [--progress] [--english]
The inventory is the review record. Heuristic English findings need human review;
they are reported, never silently treated as translation failures.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "specs/001-simplified-chinese-vault/inventory.md"
INVENTORY_ROW = re.compile(r"^- \[([ xX])\] `([^`]+)`$", re.M)
FRONTMATTER_KEY = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*):", re.M)
WIKILINK = re.compile(r"!?\[\[([^\]|#]+)")
BARE_WIKILINK = re.compile(r"(?<!!)\[\[([^\]|]+)\]\]")
QUICKADD_COMMAND = re.compile(r"quickadd:choice:[A-Za-z0-9_-]+")
TEMPLATER_BLOCK = re.compile(r"<%[\s\S]*?%>")
QUICKADD_TOKEN = re.compile(r"\{\{[^{}]+\}\}")
ENGLISH_PROSE = re.compile(r"\b[A-Za-z]{3,}(?:[ \t]+[A-Za-z]{2,}){3,}\b")


def git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=ROOT, text=True, encoding="utf-8",
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
    )
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or "git failed")
    return result.stdout


def frontmatter_keys(text: str) -> set[str]:
    if not text.startswith("---\n"):
        return set()
    end = text.find("\n---\n", 4)
    if end < 0:
        return set()
    return set(FRONTMATTER_KEY.findall(text[4:end]))


def wikilink_targets(text: str) -> set[str]:
    # In Markdown tables, Obsidian requires the alias separator as \|.
    return {target.removesuffix("\\") for target in WIKILINK.findall(text)}


def plain_prose(text: str) -> list[str]:
    """Return heuristic English candidates outside code and metadata."""
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end >= 0:
            text = text[end + 5:]
    text = re.sub(r"```[\s\S]*?```", "", text)
    text = re.sub(r"`[^`]*`", "", text)
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"!?\[\[[^\]]+\]\]", "", text)
    return [line.strip() for line in text.splitlines()
            if ENGLISH_PROSE.search(line) and not re.search(r"[\u4e00-\u9fff]", line)]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--progress", action="store_true", help="Allow pending inventory rows")
    parser.add_argument("--english", action="store_true", help="Show possible remaining English prose")
    args = parser.parse_args()

    if not INVENTORY.exists():
        print(f"Missing inventory: {INVENTORY}", file=sys.stderr)
        return 2
    entries = INVENTORY_ROW.findall(INVENTORY.read_text(encoding="utf-8"))
    if not entries:
        print("Inventory has no target rows", file=sys.stderr)
        return 2
    note_stems = {Path(rel).stem for _, rel in entries if rel.endswith(".md")}

    base = git("merge-base", "HEAD", "origin/main").strip()
    errors: list[str] = []
    pending: list[str] = []
    candidates: list[tuple[str, int, str]] = []
    for mark, rel in entries:
        path = ROOT / rel
        if not path.is_file():
            errors.append(f"Missing target: {rel}")
            continue
        if mark == " ":
            pending.append(rel)
        try:
            before = git("show", f"{base}:{rel}")
        except RuntimeError as exc:
            errors.append(f"Missing baseline for {rel}: {exc}")
            continue
        after = path.read_text(encoding="utf-8-sig")

        if rel.endswith(".md"):
            removed_keys = frontmatter_keys(before) - frontmatter_keys(after)
            if removed_keys:
                errors.append(f"Frontmatter keys removed in {rel}: {sorted(removed_keys)}")
            removed_links = wikilink_targets(before) - wikilink_targets(after)
            if removed_links:
                errors.append(f"Wikilink targets removed in {rel}: {sorted(removed_links)}")
            if len(TEMPLATER_BLOCK.findall(before)) != len(TEMPLATER_BLOCK.findall(after)):
                errors.append(f"Templater block count changed in {rel}")
            if sorted(QUICKADD_TOKEN.findall(before)) != sorted(QUICKADD_TOKEN.findall(after)):
                errors.append(f"QuickAdd tokens changed in {rel}")
            visible = re.sub(r"```[\s\S]*?```", "", after)
            visible = re.sub(r"`[^`]*`", "", visible)
            for line in visible.splitlines():
                if line.lstrip().startswith("|") and re.search(r"\[\[[^\]]*?(?<!\\)\|[^\]]*\]\]", line):
                    errors.append(f"Unescaped wikilink alias in Markdown table: {rel}")
            for match in BARE_WIKILINK.finditer(visible):
                target = match.group(1)
                stem = target.split("#", 1)[0].replace("\\", "/").rsplit("/", 1)[-1]
                if stem in note_stems and stem != "Triggers (Marshall Goldsmith)":
                    errors.append(f"Untranslated visible wikilink label in {rel}: {target}")
            if args.english:
                for number, line in enumerate(plain_prose(after), 1):
                    candidates.append((rel, number, line[:140]))

        if rel.endswith(".js"):
            removed = set(QUICKADD_COMMAND.findall(before)) - set(QUICKADD_COMMAND.findall(after))
            if removed:
                errors.append(f"QuickAdd command IDs removed in {rel}: {sorted(removed)}")

        if rel.endswith(".svg"):
            try:
                root = ET.fromstring(after)
            except ET.ParseError as exc:
                errors.append(f"Invalid SVG in {rel}: {exc}")
            else:
                if args.english:
                    for node in root.iter():
                        if node.tag.rpartition("}")[2] in {"title", "desc", "text", "tspan"}:
                            label = (node.text or "").strip()
                            if ENGLISH_PROSE.search(label) and not re.search(r"[\u4e00-\u9fff]", label):
                                candidates.append((rel, 0, label[:140]))

    config = ROOT / ".obsidian/plugins/quickadd/data.json"
    before_config = json.loads(git("show", f"{base}:.obsidian/plugins/quickadd/data.json"))
    after_config = json.loads(config.read_text(encoding="utf-8-sig"))
    for field in ("id", "type", "command"):
        old = [choice.get(field) for choice in before_config.get("choices", [])]
        new = [choice.get(field) for choice in after_config.get("choices", [])]
        if old != new:
            errors.append(f"QuickAdd choice {field} list changed")

    print(f"Base: {base[:12]}; targets: {len(entries)}; complete: {len(entries)-len(pending)}; pending: {len(pending)}")
    if pending:
        print("Pending:", ", ".join(pending[:8]) + (" ..." if len(pending) > 8 else ""))
    if args.english:
        print(f"Possible English prose lines: {len(candidates)} (heuristic; review context)")
        for rel, number, line in candidates[:30]:
            print(f"  {rel}: candidate {number}: {line}")
    for error in errors:
        print("ERROR:", error, file=sys.stderr)
    if errors or (pending and not args.progress):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
