# StarMap AI

一个用于聚合多个 AI 模型页面的浏览器扩展（Chrome / Edge）。在同一屏幕并排打开多个模型，用一个输入框一键发送同一段 prompt，对比答案、提高效率。

## 功能
- 多模型聚合：ChatGPT / Claude / Gemini / DeepSeek / Kimi / 通义千问 / 豆包 / 元宝等（可配置）
- 一键发送：对选中的模型页面同时填入并发送
- 横向滚动联动：在网格与 iframe 中更顺滑切换
- 一键导出：将各模型输出汇总导出为 Markdown（不含搜索引擎）

## 隐私
- 0 信息收集：不收集账号、Cookie、聊天内容、输入内容、浏览历史
- 0 数据上传：不上传任何数据到开发者服务器（本项目无后端）
- 仅做聚合：所有操作在本地浏览器内完成

更多细节见 [PRIVACY.md](PRIVACY.md)。

## 安装（开发者模式）
### Chrome
1. 打开 `chrome://extensions/`
2. 开启“开发者模式”
3. 点击“加载解压缩”
4. 选择 `starmap-ai-extension` 文件夹

### Edge
1. 打开 `edge://extensions/`
2. 开启“开发人员模式”
3. 点击“加载解压缩”
4. 选择 `starmap-ai-extension` 文件夹

## 使用
1. 点击扩展图标打开 Dashboard
2. 在设置里勾选要聚合的模型
3. 在底部输入框输入 prompt，点击 Send

## 权限说明（为什么需要这些权限）
- `tabs` / `activeTab`：向当前 Dashboard 标签页发送消息、管理 iframe 所在 tab
- `declarativeNetRequest`：允许部分站点在 iframe 中加载（移除 `X-Frame-Options` / `CSP` 等限制）
- `storage`：仅用于本地保存模型选择、界面状态

## 代码结构
- `starmap-ai-extension/manifest.json`：扩展入口与权限
- `starmap-ai-extension/dashboard.html` / `dashboard.js`：聚合面板
- `starmap-ai-extension/content.js`：注入第三方站点的自动填写/发送逻辑
- `starmap-ai-extension/extractors.js`：输出提取逻辑（用于导出）
- `starmap-ai-extension/net_rules.json`：DNR 规则（允许 iframe）

## 注意事项 / 最佳实践
- 同时打开过多模型会卡顿或加载慢，建议同时聚合 3–5 个为宜
- 请先在各站点完成登录，否则模型可能无法正常使用
- 若有同类插件（自动发送/聚合），建议关闭避免冲突

## License
非商用、禁止二次分发修改版许可，见 [LICENSE](LICENSE)。
