---
birthdate:
life_expectancy: 80
daily_folder: 01 Journal/Daily
weekly_folder: 01 Journal/Weekly
quarterly_folder: 01 Journal/Quarterly
retreat_folder: 02 Retreats
projects_folder: 04 Projects
dq_prefix: dq_
habit_prefix: habit_
wheel_prefix: wheel_
board_done_lanes: 已完成,已发布,归档,Done,Published,Archive
questions:
  - key: dq_goals
    text: 今天我是否尽力设定了清晰的目标？
  - key: dq_progress
    text: 今天我是否尽力朝目标前进？
  - key: dq_meaning
    text: 今天我是否尽力寻找意义？
  - key: dq_happy
    text: 今天我是否尽力让自己快乐？
  - key: dq_relationships
    text: 今天我是否尽力建立积极的人际关系？
  - key: dq_engaged
    text: 今天我是否尽力全心投入？
habits:
  - habit_journal
  - habit_exercise
  - habit_reading
wheel_areas:
  - wheel_health
  - wheel_relationships
  - wheel_family
  - wheel_career
  - wheel_finances
  - wheel_growth
  - wheel_fun
  - wheel_meaning
---
# Compass 配置

这是系统读取配置的统一入口。`Meta/views/` 中的仪表盘组件使用 `dv.page("Meta/Compass Config")` 读取本页，新建日记、个人静修和每日问题时也会读取下方列表。在这里修改配置即可，无需移动其他文件。

## 个人信息
| 属性 | 用途 | 说明 |
| --- | --- | --- |
| `birthdate` | 人生时间组件 | ISO 日期，格式为 `YYYY-MM-DD`；填写前保持空白。 |
| `life_expectancy` | 人生时间组件 | 预期寿命，单位为年。 |

## 每日问题（`questions`）
“今天我是否尽力……”以 1 到 10 分评价，来自 Marshall Goldsmith 的《Triggers》。评价努力程度，而非结果。默认提供他的六个通用问题。可修改问题文字、重命名属性键（保留 `dq_` 前缀、使用小写且不含空格），也可增删条目。新日记会自动采用更新后的列表；晚间提示词按此顺序提问；仪表盘会识别所有 `dq_*` 属性。

视频中 Mike Schmitz 使用的问题如下。如更适合你，可替换上方列表：
```yaml
questions:
  - {key: dq_spiritual, text: 今天我是否尽力在精神层面成长？}
  - {key: dq_spouse, text: 今天我是否尽力爱我的伴侣？}
  - {key: dq_kids, text: 今天我是否尽力关爱孩子？}
  - {key: dq_friend, text: 今天我是否尽力做一个好朋友？}
  - {key: dq_learn, text: 今天我是否尽力学习新东西？}
  - {key: dq_create, text: 今天我是否尽力创作？}
  - {key: dq_exercise, text: 今天我是否尽力锻炼？}
```

## 习惯（`habits`）
每篇新日记都会添加这些复选属性。每个阶段保持 3 到 5 项，并保留 `habit_` 前缀。

## 生活之轮（`wheel_areas`）
每篇新建的个人静修笔记都会添加这些 1 到 10 分的数值属性。可自行重命名，但需保留 `wheel_` 前缀；雷达图会根据属性键生成标签。

## 文件夹与前缀
| 属性 | 用途 |
| --- | --- |
| `daily_folder`、`weekly_folder`、`quarterly_folder`、`retreat_folder`、`projects_folder` | 组件与快捷链接；必须与 Periodic Notes 设置一致。 |
| `dq_prefix`、`habit_prefix`、`wheel_prefix` | 识别对应属性。 |
| `board_done_lanes` | 看板仪表盘计为已完成的 Kanban 列名。 |

若要自定义问题，可修改 `text`。更改属性键时，请保留 `dq_` 前缀（例如 `dq_aprender`），这样图表仍能识别。
