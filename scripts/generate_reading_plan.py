#!/usr/bin/env python3
"""生成 09 Reading/Reading Plan.md：每章一项 Obsidian Tasks 任务，分配到指定天数。

Usage:
  python3 scripts/generate_reading_plan.py --start 2026-09-01 --days 365 > "09 Reading/Reading Plan.md"
  python3 scripts/generate_reading_plan.py --start 2026-09-01 --order chronological > "09 Reading/Reading Plan.md"

每项任务链接到章节笔记（09 Reading/Chapters/<Book> <N>.md）。
日记中的阅读提示框会查询今天及更早安排、尚未完成的章节。
"""
import argparse
import datetime as dt

BOOKS = [
    ("Genesis", 50), ("Exodus", 40), ("Leviticus", 27), ("Numbers", 36), ("Deuteronomy", 34),
    ("Joshua", 24), ("Judges", 21), ("Ruth", 4), ("1 Samuel", 31), ("2 Samuel", 24),
    ("1 Kings", 22), ("2 Kings", 25), ("1 Chronicles", 29), ("2 Chronicles", 36), ("Ezra", 10),
    ("Nehemiah", 13), ("Esther", 10), ("Job", 42), ("Psalms", 150), ("Proverbs", 31),
    ("Ecclesiastes", 12), ("Song of Solomon", 8), ("Isaiah", 66), ("Jeremiah", 52), ("Lamentations", 5),
    ("Ezekiel", 48), ("Daniel", 12), ("Hosea", 14), ("Joel", 3), ("Amos", 9),
    ("Obadiah", 1), ("Jonah", 4), ("Micah", 7), ("Nahum", 3), ("Habakkuk", 3),
    ("Zephaniah", 3), ("Haggai", 2), ("Zechariah", 14), ("Malachi", 4),
    ("Matthew", 28), ("Mark", 16), ("Luke", 24), ("John", 21), ("Acts", 28),
    ("Romans", 16), ("1 Corinthians", 16), ("2 Corinthians", 13), ("Galatians", 6), ("Ephesians", 6),
    ("Philippians", 4), ("Colossians", 4), ("1 Thessalonians", 5), ("2 Thessalonians", 3), ("1 Timothy", 6),
    ("2 Timothy", 4), ("Titus", 3), ("Philemon", 1), ("Hebrews", 13), ("James", 5),
    ("1 Peter", 5), ("2 Peter", 3), ("1 John", 5), ("2 John", 1), ("3 John", 1),
    ("Jude", 1), ("Revelation", 22),
]

# A common book-level chronological ordering (approximate; chapter-level interleaving is a
# refinement you can do by editing the output).
CHRONOLOGICAL_BOOKS = [
    "Genesis", "Job", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Chronicles", "Psalms", "2 Chronicles", "1 Kings", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "2 Kings", "Obadiah", "Joel", "Jonah", "Amos", "Hosea",
    "Micah", "Isaiah", "Nahum", "Zephaniah", "Habakkuk", "Jeremiah", "Lamentations", "Ezekiel",
    "Daniel", "Ezra", "Haggai", "Zechariah", "Esther", "Nehemiah", "Malachi",
    "Luke", "Mark", "Matthew", "John", "Acts", "James", "Galatians", "1 Thessalonians",
    "2 Thessalonians", "1 Corinthians", "2 Corinthians", "Romans", "Ephesians", "Philippians",
    "Colossians", "Philemon", "1 Timothy", "Titus", "1 Peter", "2 Timothy", "2 Peter", "Hebrews",
    "Jude", "1 John", "2 John", "3 John", "Revelation",
]


def chapters(order):
    counts = dict(BOOKS)
    names = [b for b, _ in BOOKS] if order == "canonical" else CHRONOLOGICAL_BOOKS
    for b in names:
        for c in range(1, counts[b] + 1):
            yield f"{b} {c}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", required=True, help="YYYY-MM-DD")
    ap.add_argument("--days", type=int, default=365)
    ap.add_argument("--order", choices=["canonical", "chronological"], default="canonical")
    ap.add_argument("--skip-weekday", type=int, action="append", default=[], help="0=周一 .. 6=周日，可重复")
    a = ap.parse_args()

    start = dt.date.fromisoformat(a.start)
    days = []
    d = start
    while len(days) < a.days:
        if d.weekday() not in a.skip_weekday:
            days.append(d)
        d += dt.timedelta(days=1)

    chs = list(chapters(a.order))
    per_day = len(chs) / len(days)
    print("---\ntags:\n  - bible\nplan: %s\nstart: %s\ndays: %d\n---" % (a.order, a.start, a.days))
    order_label = "书卷顺序" if a.order == "canonical" else "参考时间顺序"
    print("# 《圣经》阅读计划\n")
    print(f"共 {len(chs)} 章，安排在 {len(days)} 个阅读日（平均每天 {per_day:.2f} 章），采用{order_label}；由 scripts/generate_reading_plan.py 生成。\n")
    print("## 计划")
    for i, ch in enumerate(chs):
        day = days[min(int(i / per_day), len(days) - 1)]
        print(f"- [ ] 阅读 [[{ch}]] ⏳ {day.isoformat()}")


if __name__ == "__main__":
    main()
