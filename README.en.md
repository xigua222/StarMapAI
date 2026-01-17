<div align="center">
  <img src="starmap-ai-extension/starmapai.png" width="96" height="96" alt="StarMap AI" />
  <h1>StarMap AI</h1>
  <p>A multi-model browser extension (Chrome / Edge): open multiple AI chats side-by-side, send one prompt to all, compare answers fast.</p>
  <p>
    <a href="README.zh-CN.md">中文</a>
    ·
    <a href="README.en.md">English</a>
    ·
    <a href="PRIVACY.md">Privacy</a>
    ·
    <a href="RELEASE.md">Release</a>
  </p>
</div>

## Why StarMap AI
- ⚡ Faster: ask once, multiple models respond in parallel
- 🧭 Safer: compare consensus vs disagreements to reduce single-model risk
- 🧩 Cleaner workflow: one dashboard instead of tab-hopping
- 🔒 Privacy-first: no data collection, no server uploads, local aggregation only

## Highlights
- Multi-site dashboard for AI models and search engines
- One-click send to selected models
- One-click export: merge model outputs into a Markdown file (search engines excluded)
- Extensible: add/update sites via `sites.js`

## Supported sites
> Site list comes from `starmap-ai-extension/sites.js`.

**AI models**
- ChatGPT (chatgpt.com)
- Claude (claude.ai)
- Gemini (gemini.google.com)
- DeepSeek (chat.deepseek.com)
- Qwen / Tongyi Qianwen (chat.qwen.ai)
- Kimi (kimi.com)
- Doubao (doubao.com)
- Yuanbao (yuanbao.tencent.com)
- Grok (grok.com)
- Wenxin Yiyan (yiyan.baidu.com)
- ChatGLM (chatglm.cn)
- MiniMax (agent.minimaxi.com)

**Search engines (can be shown in the dashboard; excluded from export)**
- Baidu / Bing / Google / Yandex

## Install (Developer Mode)
1. Open extensions page  
   - Chrome: `chrome://extensions/`  
   - Edge: `edge://extensions/`
2. Enable Developer Mode
3. Click “Load unpacked”
4. Select the `starmap-ai-extension` folder

## Usage
1. Click the extension icon to open the dashboard
2. Select models in Settings
3. Type your prompt and click Send
4. (Optional) Click “Save outputs” to export Markdown

## Privacy & License
- Privacy: see [PRIVACY.md](PRIVACY.md)
- License: non-commercial, no-derivatives (no redistribution of modified versions), see [LICENSE](LICENSE)

