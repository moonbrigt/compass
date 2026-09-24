# 插件配置

## 视频中使用的插件

| 插件 | ID | 用途 | 配置位置 |
| --- | --- | --- | --- |
| **QuickAdd** | `quickadd` | 把日记、收获、感恩写入每日笔记；把任务送进任务总表；把创意送进看板 | `.obsidian/plugins/quickadd/data.json`，8 个捕获命令 |
| **Periodic Notes** | `periodic-notes` | 在对应文件夹创建每日、每周、每季度笔记 | `.obsidian/plugins/periodic-notes/data.json` |
| **Obsidian Tasks** | `obsidian-tasks-plugin` | 行内任务与仪表盘、人物、项目、阅读计划中的 `tasks` 查询 | `.obsidian/plugins/obsidian-tasks-plugin/data.json` |
| **Dataview** | `dataview` | 习惯、每日问题、生命之轮、项目等动态视图 | `.obsidian/plugins/dataview/data.json`；需启用 JavaScript 查询 |
| **Kanban** | `obsidian-kanban` | 每种写作类型各有一个看板 | `06 写作/` 下各 `* Board.md` |
| **Bases**（Obsidian 1.9+ 内置） | 内置 | 原视频用它显示“往年今日”；本仓库默认用 DataviewJS 实现，下面提供可选的 Bases 版本 | 本指南末尾 |

## 视频之后增配的插件

| 插件 | ID | 用途 | 说明 |
| --- | --- | --- | --- |
| **Agent Client** 0.12.1 | `agent-client` | 在 Obsidian 中使用 Claude Code；仪表盘按钮与内嵌聊天 | [[14 Agent Client and Claude Code\|Agent Client 与 Claude Code]] |
| **SEO** 0.5.6 | `seo` | 发布前检查 `06 写作` 中的文章 | [[16 SEO, Web Viewer, and Vault Lens\|SEO、网页查看器与 Vault Lens]] |
| **Omnisearch** 1.30.1 | `omnisearch` | 仓库搜索；也可作为 Vault Lens 浏览器扩展的搜索来源 | [[17 Search Providers\|搜索服务]] |
| **Local REST API** 5.1.0 | `obsidian-local-rest-api` | 浏览器扩展的笔记预览/编辑来源，以及本机 API | [[17 Search Providers\|搜索服务]] |
| **Web viewer** | `webviewer`（内置） | 在 Obsidian 中浏览、剪藏网页 | [[16 SEO, Web Viewer, and Vault Lens\|SEO、网页查看器与 Vault Lens]] |

## 模板需要的插件

| 插件 | ID | 用途 |
| --- | --- | --- |
| **Templater** | `templater-obsidian` | 处理周记、季记的日期计算和“每日问题”属性填写；文件夹模板自动套用项目、人物、静修及写作模板。 |

## 仓库自带应用

| 插件 | ID | 用途 |
| --- | --- | --- |
| **Life OS** | `life-os-app` | 导航、统一捕获、运行状态和工作流面板；直接读取仓库里的 Markdown 与属性，不建立第二套数据库。参见 [[21 Life OS Application\|Life OS 应用]]。 |

插件主页：[QuickAdd](https://github.com/chhoumann/quickadd) · [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) · [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) · [Dataview](https://github.com/blacksmithgu/obsidian-dataview) · [Kanban](https://github.com/mgmeyers/obsidian-kanban) · [Templater](https://github.com/SilentVoid13/Templater)

## 首次打开仓库

十个社区插件和仓库自带的 Life OS 已放在 `.obsidian/plugins/` 中，并列于 `community-plugins.json`。

1. 打开“设置 → 第三方插件”，信任仓库作者并启用插件。Obsidian 对每个仓库分别询问一次；这项授权不写入仓库文件。若插件未立即生效，在命令面板搜索“重新加载”并运行 **重新加载 Obsidian（不保存当前编辑内容）**。布局加载后 Life OS 会自动打开；此后可用罗盘图标或命令 **Life OS: 打开 Life OS 首页** 打开。
2. 在“设置 → 外观 → CSS 代码片段”确认 `lifeos` 已开启，供 `reading`、`intention`、`memento`、`theme` 提示框使用。
3. 在 Templater 确认“创建新文件时触发 Templater”和“文件夹模板”已开启。
4. 在 Periodic Notes 确认日记 `YYYY-MM-DD` → `01 日记/每日`，周记 `gggg-[W]ww` → `01 日记/每周`，季记 `YYYY-[Q]Q` → `01 日记/季度`，并各自绑定模板。内置 Daily Notes 已关闭。用下方 QuickAdd 热键创建笔记并运行 Templater；Periodic Notes 与 Calendar 用于导航。若从链接打开的笔记为空或仍显示 `<%`，按 `Alt+E` 插入相应模板。
5. 在 QuickAdd 确认共有 20 个选项，并且都已开启闪电图标对应的命令：8 个写入现有笔记，4 个打开周期/静修笔记，8 个按模板新建项目、人物、创作、读书或研读笔记。
6. 在 Dataview 确认“启用 JavaScript 查询”已开启；预置配置已设为开启。
7. 打开 `00 仪表盘/Compass Dashboard.md`。某个组件提示找不到数据时，通常是空状态提示。

## 预设快捷键

| 按键 | 操作 |
| --- | --- |
| Ctrl/Cmd+Shift+L | 打开 Life OS |
| Ctrl/Cmd+Shift+C | 打开统一捕获 |
| Ctrl/Cmd+Shift+D | 创建或打开今日日记 |
| Ctrl/Cmd+Alt+W | 创建或打开本周笔记 |
| Ctrl/Cmd+Alt+Q | 创建或打开本季度笔记 |
| Ctrl/Cmd+Shift+J | 向今日日记追加带时间的记录 |
| Ctrl/Cmd+Shift+W | 记录一件好事 |
| Ctrl/Cmd+Shift+G | 记录感恩 |
| Ctrl/Cmd+Shift+T | 向任务总表添加任务 |
| Ctrl/Cmd+Shift+Q | 打开今日日记后填写每日问题 |

可在“设置 → 快捷键”修改；修改后重新加载以确保生效。以后更新插件可在“设置 → 第三方插件 → 检查更新”操作。

## QuickAdd 捕获选项

若预置配置被拒绝，可按下表手动重建。路径和标题必须与笔记一致。

| 名称 | 写入位置 | 格式 | 插入到标题后 |
| --- | --- | --- | --- |
| 📝 记录日记 | `01 日记/每日/{{DATE:YYYY-MM-DD}}.md`，使用日记模板创建 | `- {{DATE:HH:mm}} {{VALUE}}` | `## 日记` |
| 🏆 记录一件好事 | 同上 | `- {{VALUE}}` | `## 收获` |
| 🙏 记录感恩 | 同上 | `- {{VALUE}}` | `## 感恩` |
| ✅ 添加任务（任务总表） | `08 任务/Tasks.md` | `- [ ] {{VALUE}} ➕ {{DATE:YYYY-MM-DD}}` | `## 收件箱` |
| ✉️ 通讯选题 → 想法 | `06 写作/通讯/Newsletter Board.md` | `- [ ] {{VALUE}}` | `## 想法` |
| 🎬 视频选题 → 想法 | `06 写作/YouTube 脚本/YouTube Board.md` | `- [ ] {{VALUE}}` | `## 想法` |
| 📰 文章选题 → 想法 | `06 写作/文章/Article Board.md` | `- [ ] {{VALUE}}` | `## 想法` |
| 💡 项目想法 → 项目看板 | `04 项目/Projects Board.md` | `- [ ] {{VALUE}}` | `## 想法` |

其余 12 个是模板选项。**📅 打开今日笔记、🗓️ 打开本周笔记、🧭 打开本季度笔记、🏕️ 新建本季度个人静修笔记**按日期在对应文件夹创建或打开笔记。以下八个选项先询问名称，再按模板创建并打开笔记；已有同名笔记不会被覆盖。

| 名称 | 新笔记路径 | 模板 |
| --- | --- | --- |
| 📁 新建项目 | `04 项目/{{VALUE}}.md` | `模板/Project.md` |
| 👤 新建人物笔记 | `05 人物/{{VALUE}}.md` | `模板/Person.md` |
| ✉️ 新建通讯 | `06 写作/通讯/{{VALUE}}.md` | `模板/Newsletter.md` |
| 🎬 新建视频脚本 | `06 写作/YouTube 脚本/{{VALUE}}.md` | `模板/YouTube Script.md` |
| 📰 新建文章 | `06 写作/文章/{{VALUE}}.md` | `模板/Article.md` |
| 🎓 新建课程课时 | `06 写作/课程内容/{{VALUE}}.md` | `模板/Course Lesson.md` |
| 📚 新建读书笔记 | `07 资料库/读书笔记/{{VALUE}}.md` | `模板/Book Note.md` |
| 📖 新建研读笔记 | `09 阅读/研读笔记/{{VALUE}}.md` | `模板/Study Note.md` |

Life OS 与仪表盘按钮使用预置选项的固定 ID（例如 `lifeos-journal`），显示名称可改，ID 应保持不变。

## 用 Bases 实现“往年今日”（可选）

创建 `元数据/On This Day.base`，在日记模板中嵌入 `![[On This Day.base]]`：

```yaml
filters:
  and:
    - file.inFolder("01 日记/每日")
    - file.name != this.file.name
    - file.name.endsWith(this.file.name.slice(4))
views:
  - type: table
    name: 往年今日
    order:
      - file.name
    sort:
      - property: file.name
        direction: DESC
```

Bases 公式语法仍可能变化，使用前按当前 Obsidian 版本核对[官方函数文档](https://help.obsidian.md/bases/functions)。
