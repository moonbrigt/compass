# SEO、网页查看器与 Vault Lens

这三项用于在仓库中研究、写作和发布。

## 网页查看器

Obsidian 内置 Web viewer，在 `core-plugins.json` 中启用。模板的 `.obsidian/webviewer.json` 预置外部链接在查看器中打开、拦截广告，并把保存的页面放入 `07 Library`。这些键来自公开仓库中的配置样例，并非已核对的官方配置契约；首次使用时请到设置里确认。可以在 Obsidian 内阅读网页，把页面放在草稿旁，或用“保存到仓库”与 Web Clipper 配合。设置入口是“设置 → 核心插件 → 网页查看器”，可选择外链打开方式、搜索引擎和清理浏览数据。

## SEO 插件

[SEO](https://github.com/davidvkimball/obsidian-seo)（`seo` 0.5.6）检查拟发布笔记的标题和描述长度、关键词位置、标题层级、图片替代文字、无效链接、重复标题、可读性与字数，评分范围为 40–100。

- 可运行“检查当前笔记”或“检查整个仓库”命令。
- 在“设置 → SEO → 扫描目录”设 `06 Writing`；若发布读书笔记，也可加 `07 Library`。日记不应进入发布检查。
- 外部链接检查默认关闭，且需要联网；模板保持关闭。
- 插件读取 `title`、`description`、`slug`、`keywords` 等可配置属性。当前写作模板使用 `subject`、`meta_description`、`slug`；若要让草稿得到正确评分，在 SEO 设置中对应这些字段。
- 此插件属于作者的 Vault CMS 项目，不依赖具体发布平台。

## Vault Lens 浏览器扩展

[Vault Lens](https://github.com/jk-oster/obsidian-search-for-web)（原名 Obsidian Search for Web）会在网页搜索结果旁及重访页面时显示相关仓库笔记。它需要本机提供搜索接口；安装和数据安全说明见 [[17 Search Providers|搜索服务]]。

可用网页查看器阅读，用 Web Clipper 和 Vault Lens 捕获及重新发现资料，通过 [[14 Agent Client and Claude Code|Agent Client 与 Claude Code]] 辅助在 `06 Writing` 起草，最后用 SEO 检查。
