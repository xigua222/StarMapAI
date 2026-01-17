<div align="center">
  <img src="starmap-ai-extension/starmapai.png" width="96" height="96" alt="StarMap AI" />
  <h1>StarMap AI</h1>
  <p>把多个 AI 模型并排放到同一个 Dashboard：一键发送同一段 prompt，快速对比答案、发现分歧、做出更稳的决策。</p>
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

## 亮点
- ⚡ 一键驱动：输入一次，多个模型同时响应
- 🧭 聚合对比：同屏查看不同模型的共同点与分歧点
- 🧱 可扩展站点：通过配置快速支持更多模型/站点
- 🔒 隐私优先：0 信息收集；0 数据上传；仅做本地聚合
- 🧾 一键导出：将各模型输出汇总导出为 Markdown（不含搜索引擎）

## 支持的网站
> 站点列表来自 `starmap-ai-extension/sites.js`，如果站点 DOM 变化，可自行更新 selector。

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

**搜索引擎（可聚合展示，且导出时自动排除）**
- Baidu / Bing / Google / Yandex

## 快速开始（Chrome / Edge）
1. 打开扩展管理页  
   - Chrome：`chrome://extensions/`  
   - Edge：`edge://extensions/`
2. 开启“开发者模式”
3. 点击“加载解压缩”
4. 选择 `starmap-ai-extension` 文件夹
5. 点击扩展图标打开 Dashboard 开始使用

## 使用建议
- ✅ 推荐同时聚合 3–5 个模型：更流畅、更稳定
- ✅ 首次使用请先在各站点完成登录：否则模型可能无法正常响应
- ✅ 若有同类插件（自动填充/自动发送/聚合多模型）：建议关闭以免冲突

## 隐私与许可
- 隐私说明：[PRIVACY.md](PRIVACY.md)
- 许可：禁止商用 + 禁止二次分发修改版，见 [LICENSE](LICENSE)

## 项目结构
- `starmap-ai-extension/`：扩展源码
- `starmap-ai-release/`：本地打包目录（通常不提交 Git）
