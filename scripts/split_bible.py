#!/usr/bin/env python3
"""把纯文本《圣经》分拆为章节笔记和经节笔记。

Input format (one verse per line, tab separated; the common format of public-domain KJV/WEB dumps):
    Genesis 1:1<TAB>In the beginning God created the heaven and the earth.

Usage:
    python3 scripts/split_bible.py kjv.txt --out "09 阅读"

Writes:
    <out>/Chapters/<Book> <N>.md     full chapter text + links to every verse note
    <out>/Verses/<Book> <N>.<V>.md   one verse, previous/next links, frontmatter for Dataview

已有文件会被覆盖。完整文本约有三万一千篇经节笔记；首次索引需要时间。
可用 --books 限定书卷，例如 --books "Genesis,John"。
"""
import argparse
import os
import re
from collections import OrderedDict

LINE = re.compile(r"^(?P<book>[1-3]?\s?[A-Za-z ]+?)\s+(?P<ch>\d+):(?P<v>\d+)\t(?P<text>.+)$")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--out", default="09 阅读")
    ap.add_argument("--books", default="", help="以逗号分隔的书卷名称")
    ap.add_argument("--translation", default="KJV")
    a = ap.parse_args()

    only = {b.strip() for b in a.books.split(",") if b.strip()}
    data = OrderedDict()
    with open(a.source, encoding="utf-8") as f:
        for raw in f:
            m = LINE.match(raw.rstrip("\n"))
            if not m:
                continue
            book = m.group("book").strip()
            if only and book not in only:
                continue
            ch, v = int(m.group("ch")), int(m.group("v"))
            data.setdefault(book, OrderedDict()).setdefault(ch, OrderedDict())[v] = m.group("text").strip()

    chap_dir = os.path.join(a.out, "Chapters")
    verse_dir = os.path.join(a.out, "Verses")
    os.makedirs(chap_dir, exist_ok=True)
    os.makedirs(verse_dir, exist_ok=True)

    n_ch = n_v = 0
    for book, chapters in data.items():
        for ch, verses in chapters.items():
            cname = f"{book} {ch}"
            prev_ch = f"{book} {ch - 1}" if ch > 1 else None
            next_ch = f"{book} {ch + 1}" if (ch + 1) in chapters else None
            nav = " · ".join(x for x in [f"上一章：[[{prev_ch}]]" if prev_ch else "", f"下一章：[[{next_ch}]]" if next_ch else ""] if x)
            body = [
                "---", "type: bible-chapter", f"book: {book}", f"chapter: {ch}", f"translation: {a.translation}",
                "tags:", "  - bible/chapter", "---", f"# {cname}", "", nav, "", "## 正文",
            ]
            body += [f"{v}. {t}" for v, t in verses.items()]
            body += ["", "## 经节", " · ".join(f"[[{book} {ch}.{v}]]" for v in verses), "",
                     "## 引用本章的笔记与讲道", "```dataview", "LIST",
                     'WHERE contains(file.outlinks, this.file.link) AND !contains(file.folder, "09 阅读/章节")', "```", ""]
            with open(os.path.join(chap_dir, cname + ".md"), "w", encoding="utf-8") as f:
                f.write("\n".join(body))
            n_ch += 1

            vkeys = list(verses)
            for i, v in enumerate(vkeys):
                vname = f"{book} {ch}.{v}"
                links = [f"章节：[[{cname}]]"]
                if i > 0:
                    links.append(f"上一节：[[{book} {ch}.{vkeys[i - 1]}]]")
                if i + 1 < len(vkeys):
                    links.append(f"下一节：[[{book} {ch}.{vkeys[i + 1]}]]")
                vb = ["---", "type: bible-verse", f"book: {book}", f"chapter: {ch}", f"verse: {v}",
                      f"translation: {a.translation}", "tags:", "  - bible/verse", "---",
                      f"# {book} {ch}:{v}", "", verses[v], "", " · ".join(links), ""]
                with open(os.path.join(verse_dir, vname + ".md"), "w", encoding="utf-8") as f:
                    f.write("\n".join(vb))
                n_v += 1
    print(f"已向 {a.out} 写入 {n_ch} 篇章节笔记和 {n_v} 篇经节笔记")


if __name__ == "__main__":
    main()
