// Compass 组件约定。Dataview 视图不能互相导入，因此各视图自行声明所需逻辑。
// 本文件仅供参考。
//
// 约定：
//   - 日记命名为 YYYY-MM-DD，位于 cfg.daily_folder。
//   - 每日问题是名为 <dq_prefix><name> 的数值属性（1 到 10 分）。
//   - 习惯是名为 <habit_prefix><name> 的复选属性。
//   - 生活之轮领域是名为 <wheel_prefix><name> 的数值属性（1 到 10 分），
//     位于“<retreat_folder>/YYYY-QN Personal Retreat”笔记中。
//   - Obsidian 中可全局调用 moment()。
