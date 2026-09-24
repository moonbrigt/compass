# Vault Lens 搜索服务

[Vault Lens](https://github.com/jk-oster/obsidian-search-for-web) 浏览器扩展会在网页搜索结果旁以及重访页面时显示相关仓库笔记；它连接 Obsidian 内运行的本机服务。下表记录模板所附服务及原项目安全审查作出的选择。

| 插件 | 模板状态 | 原因 |
| --- | --- | --- |
| **Local REST API** 5.1.0 | 已安装、启用，HTTP 端口 27123 | 支持 Vault Lens 的预览、编辑、追加、日记与当前网页关联笔记。每台电脑有独立 bearer API 密钥，默认仅绑定 `127.0.0.1`。Vault Lens 的默认连接方式为 `http`、27123，用户需自行填入密钥。 |
| **Omnisearch** 1.30.1 | 已安装、启用；其 HTTP 服务默认关闭 | 仓库内搜索支持相关度排序与拼写容错；但 HTTP 接口没有认证，并允许任意来源读取。除非明确需要，否则保持关闭。若启用，实际端口为 51361；Vault Lens 快速入门中的“51736”为原项目记录的笔误。 |

模板的 `.obsidian/plugins/obsidian-local-rest-api/data.json` 只含 `{"enableInsecureServer": true}`。插件首次加载时在用户电脑生成 API 密钥与自签名证书，并写入该文件。

## 用户设置步骤

1. 打开仓库，信任仓库作者并启用第三方插件。
2. 在“设置 → Local REST API”确认“未加密 HTTP 服务”运行于 27123，复制显示的 API 密钥。
3. 按 [Vault Lens 安装说明](https://vaultlens.com/getting-started.html) 安装对应浏览器扩展。
4. 扩展设置的“Obsidian Connection”选择 Local REST API，协议 `http`，端口 `27123`，填入密钥；仓库名称填当前打开的文件夹名称。
5. 等待绿色“连接成功”提示。
6. 用 `Guide/00 Start Here.md` 中的一个词进行网页搜索，检查扩展图标是否变绿并列出该笔记。
7. 在扩展侧栏点日记按钮，检查新笔记是否位于 `01 Journal/Daily/`。若笔记为空且缺少属性，可对活动文件运行一次“Templater: Replace templates in the active file”；QuickAdd 捕获命令仍可使用。
8. 可选：确认内置网页查看器已开启；不要在内置浏览器登录敏感网站。

## 数据与安全

- 服务只绑定回环地址；不要设置 REST API 的 `bindingHost` 或 Omnisearch 的 `DANGER_httpHost`。
- 默认使用 27123 上的 HTTP，是为避免每个用户都需导入约 365 天后到期的自签名证书。需要 HTTPS 的用户可以用 27124。
- API 密钥相当于仓库的读写密码。不要分享显示密钥的设置截图。Vault Lens 把密钥存入浏览器同步扩展存储。可在插件里使用“Reset all cryptography”轮换密钥与证书。
- 浏览器端编辑会替换整篇笔记；同一文件若也在 Obsidian 中编辑，最后写入者覆盖先前内容。
- 网页查看器基于 Chromium webview；原项目记载接受过 Cure53 审计。Obsidian 运行时，第三方插件仍可能访问网页查看器 cookie，因此密码保护的网站宜在常用浏览器中打开。

## 发布检查与取舍

`scripts/verify_template.py` 会拒绝包含生成密钥或证书的 Local REST API 设置；`scripts/build_template.py` 每次构建都会重置为 `{"enableInsecureServer": true}`，见 `scripts/RELEASE.md`。

默认为所有用户开启本机服务是一项取舍：即使未安装浏览器扩展也会启动服务。更保守的做法是只安装、不启用，代价是多一步设置。预启用 HTTP 也偏离插件默认的 HTTPS 配置；单人电脑上回环地址加 bearer 密钥可接受，共用电脑则需自行评估。
