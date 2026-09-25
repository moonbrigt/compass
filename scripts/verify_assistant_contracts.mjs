#!/usr/bin/env node
// Read system workflow definitions only. Never connects to an agent or provider.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(process.argv[2] || ".");
const source = fs.readFileSync(path.join(root, "00 仪表盘/智能助手.md"), "utf8").replace(/\r\n?/g, "\n");
const buttons = [...source.matchAll(/```agent\n([\s\S]*?)```/g)];
assert.equal(buttons.length, 16, "All 16 assistant workflows must remain available");
for (const [, block] of buttons) {
  assert.match(block, /^autoSend: false$/m, "Workflow must require a separate send action");
  assert.match(block, /^type: button$/m);
  assert.match(block, /^viewType: right-pane$/m, "Workflow must open a chat without depending on an offscreen embedded block");
  const promptPath = block.match(/vault_read 阅读 (提示词\/[^"\n，；]+?\.md)/);
  assert.ok(promptPath, "Workflow must name a local prompt");
  assert.ok(fs.existsSync(path.join(root, promptPath[1])), "Named prompt must exist");
}
assert.match(source, /## 发送前检查/);
assert.match(source, /这是一项使用规则，不能保证每个客户端都会请求批准/);
assert.match(source, /noteContext: hosting/);
assert.match(source, /不代表认证、连接或整个工作流已通过实测/);
console.log("助手契约通过：16 项工作流均关闭自动发送，提示词路径存在，且说明了上下文与批准边界；未测试原生客户端行为。");
