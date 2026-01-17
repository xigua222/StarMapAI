<div align="center">
  <img src="starmap-ai-extension/starmapai.png" width="96" height="96" alt="StarMap AI" />
  <h1>StarMap AI</h1>
  <p>多模型聚合浏览器扩展（Chrome / Edge）：同屏并排多个 AI，一键发送 prompt，高效对比答案。</p>
  <p>
    <a href="README.zh-CN.md">中文</a>
    ·
    <a href="README.en.md">English</a>
    ·
    <a href="PRIVACY.md">隐私</a>
    ·
    <a href="RELEASE.md">发布</a>
  </p>
</div>

## 为什么用 StarMap AI
- ⚡ 更快：一次提问，多模型并行给出答案
- 🧭 更稳：对比共同点/分歧点，减少“单模型幻觉”风险
- 🧩 更顺：同屏聚合，不用反复切标签页
- 🔒 更安心：不收集、不上传数据，仅做本地聚合

## 功能特性
- 🧱 多站点聚合：把多个模型（以及搜索引擎）放进一个 Dashboard
- 📨 一键发送：对选中的模型页面同时填入并发送
- 🧾 一键导出：将各模型输出汇总导出为 Markdown（导出时自动排除搜索引擎）
- 🧰 可扩展：通过 `sites.js` 配置快速加站点/改 selector
- 🖱️ 体验优化：横向滚动更顺滑、支持设置选择模型

## 支持的网站
> 站点列表来自 `starmap-ai-extension/sites.js`。

**AI 模型**
- ChatGPT（chatgpt.com）
- Claude（claude.ai）
- Gemini（gemini.google.com）
- DeepSeek（chat.deepseek.com）
- 通义千问 / Qwen（chat.qwen.ai）
- Kimi（kimi.com）
- 豆包（doubao.com）
- 腾讯元宝（yuanbao.tencent.com）
- Grok（grok.com）
- 文心一言（yiyan.baidu.com）
- ChatGLM（chatglm.cn）
- MiniMax（agent.minimaxi.com）

**搜索引擎（可聚合展示）**
- Baidu / Bing / Google / Yandex

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
2. 点击设置按钮勾选要聚合的模型
3. 在底部输入框输入 prompt，点击 Send
4. （可选）点击“保存输出”导出 Markdown

## 最佳实践
- ✅ 推荐同时聚合 3–5 个模型：更流畅、更稳定
- ✅ 提前完成登录：首次使用先分别登录各站点
- ✅ 避免插件冲突：关闭同类“自动填充/自动发送/聚合”插件
- ✅ 遇到卡顿：先减少并发数量，再刷新单个卡片

## 隐私
- 0 信息收集：不收集账号、Cookie、聊天内容、输入内容、浏览历史
- 0 数据上传：不上传任何数据到开发者服务器（本项目无后端）
- 仅做聚合：所有操作在本地浏览器内完成

详情见 [PRIVACY.md](PRIVACY.md)。

## 许可
禁止商用 + 禁止二次分发修改版，见 [LICENSE](LICENSE)。

