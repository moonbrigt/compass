# 工作流 5：每日阅读

视频：11:51–14:11。Mike 以每日《圣经》阅读说明为什么把相关资料放在同一仓库。本模板的模块也适用于其他按计划阅读的内容：一章对应一项计划任务、一篇章节笔记，研读笔记与主题索引再链接到这些章节。

这是可选模块。不需要时，可删除 `09 Reading/`，并从 `Templates/Daily Note.md` 移除 `[!reading]` 提示框。也可以改成每季度读一本书、一门课程或一组文章的计划。

## 两种笔记粒度

| | 章节笔记 | 经节笔记 |
| --- | --- | --- |
| 示例路径 | `09 Reading/Chapters/Genesis 1.md` | `09 Reading/Verses/Genesis 1.1.md` |
| 用途 | 每日阅读计划 | 讲道、主题索引、研读和读书笔记的精确链接目标 |
| 完整《圣经》的数量 | 1,189 | 31,102 |

示例仓库只附少量笔记；下述脚本可根据你提供的文本生成完整集合。

## 阅读计划

`09 Reading/Reading Plan.md` 每章一项带 ⏳ 安排日期的任务。日记里的“今日阅读”提示框运行 Tasks 查询，显示安排在今天或更早、但尚未完成的章节；未读章节会继续显示。可直接在提示框中勾选完成。

生成完整计划：

```bash
python3 scripts/generate_reading_plan.py --start 2026-09-01 --days 365 > "09 Reading/Reading Plan.md"
```

可用 `--order canonical`（默认）或 `--order chronological`（内置一种常见时间顺序），并通过 `--days 365` 设置跨度。该命令会覆盖目标文件；先备份自己的阅读计划。

## 生成章节与经节笔记

```bash
python3 scripts/split_bible.py path/to/kjv.txt --out "09 Reading"
```

输入是纯文本，每行格式为 `Book Chapter:Verse<TAB>Text`，常见于公版 KJV/WEB 文本。脚本生成含全文和经节链接的 `Chapters/<Book> <N>.md`，以及带前后链接的 `Verses/<Book> <N>.<V>.md`。约三万一千篇小笔记可由 Obsidian 管理，但首次索引需要一些时间。请自行确认输入文本的使用权。

## 交叉参照

在 `Templates/Study Note.md` 创建的讲道或研读笔记中链接每处经节；打开经节的局部关系图，就能看到相关笔记。主题页存于 `09 Reading/Topics/`；纸本划线也可转成经节笔记上的 `#highlight`、`#topic/...` 标签。

Mike 分享的[《圣经》研读资源](https://download.mikeschmitz.com/bible)。
