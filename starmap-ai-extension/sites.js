
export const SITES = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    host: 'chatgpt.com',
    inputSelector: ['#prompt-textarea'],
    submitSelector: ['[data-testid="send-button"]'],
    submitType: 'click'
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/new',
    host: 'claude.ai',
    inputSelector: ['fieldset div[contenteditable="true"]', 'div[contenteditable="true"].ProseMirror', 'div[contenteditable="true"][translate="no"]', 'div[contenteditable="true"][role="textbox"]'],
    submitSelector: ['button[type="submit"]', 'button[aria-label="Send Message"]', 'button[aria-label="Send"]', 'button[aria-label*="Send"]'], 
    submitType: 'click'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    host: 'gemini.google.com',
    inputSelector: ['div[contenteditable="true"][role="textbox"]', 'rich-textarea > div[contenteditable="true"]'],
    submitSelector: ['.send-button', 'button[aria-label="Send message"]'],
    submitType: 'click'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    host: 'chat.deepseek.com',
    inputSelector: ['textarea#chat-input', 'textarea'], 
    submitSelector: ['div[role="button"]:has(svg)', 'div[role="button"]'],
    submitType: 'enter'
  },
  {
    id: 'tongyi',
    name: 'Tongyi Qianwen',
    url: 'https://chat.qwen.ai/',
    host: 'qwen.ai',
    inputSelector: ['textarea', '#input-box'], 
    submitSelector: ['div[class*="ant-btn-primary"]', 'button[class*="ant-btn-primary"]'], 
    submitType: 'enter' 
  },
  {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://kimi.com/',
    host: 'kimi.com',
    inputSelector: [
      '.chat-input-editor[data-lexical-editor="true"]',
      '.chat-input-editor',
      'div[contenteditable="true"]', 
      '#chat-input', 
      'textarea', 
      'div[class*="chatInput"]', 
      '[data-testid="chat-input"]'
    ],
    submitSelector: [
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'div[class*="sendButton"]', 
      '.send-button', 
      'button[class*="sendButton"]', 
      'button:has(svg)',
      '[data-testid="send-button"]'
    ],
    submitType: 'click'
  },
  {
    id: 'doubao',
    name: 'Doubao',
    url: 'https://www.doubao.com/',
    host: 'doubao.com',
    inputSelector: ['div[contenteditable="true"]', 'textarea'],
    submitSelector: ['button[data-testid="chat_input_send_button"]', 'button:has(svg)'], 
    submitType: 'click'
  },
  {
    id: 'metaso',
    name: 'Metaso',
    url: 'https://metaso.cn/',
    host: 'metaso.cn',
    inputSelector: ['textarea.search-consult-textarea', 'textarea'],
    submitSelector: ['button.search-consult-submit', 'div[class*="send"]'],
    submitType: 'click'
  },
  {
    id: 'yuanbao',
    name: 'Yuanbao',
    url: 'https://yuanbao.tencent.com/chat',
    host: 'yuanbao.tencent.com',
    inputSelector: ['div[role="textbox"][contenteditable="true"]', '.ProseMirror', 'div[contenteditable="true"]'],
    submitSelector: [
      '#yuanbao-send-btn',
      'a#yuanbao-send-btn',
      'a[class*="send-btn"]',
      'button[data-testid="send-button"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'div[role="button"][aria-label*="发送"]',
      'div[class*="send-btn"]',
      'button:has(svg)'
    ],
    submitType: 'click'
  },
  {
    id: 'baidu',
    name: 'Baidu',
    url: 'https://www.baidu.com/',
    host: 'baidu.com',
    type: 'search',
    queryUrlTemplate: 'https://www.baidu.com/s?wd={q}'
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/',
    host: 'bing.com',
    type: 'search',
    queryUrlTemplate: 'https://www.bing.com/search?q={q}'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/',
    host: 'google.com',
    type: 'search',
    queryUrlTemplate: 'https://www.google.com/search?q={q}'
  },
  {
    id: 'yandex',
    name: 'Yandex',
    url: 'https://yandex.com/',
    host: 'yandex.com',
    type: 'search',
    queryUrlTemplate: 'https://yandex.com/search/?text={q}'
  },
  {
    id: 'grok',
    name: 'Grok',
    url: 'https://grok.com/',
    host: 'grok.com',
    inputSelector: [
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea'
    ],
    submitSelector: [
      'button[type="submit"]',
      'button[aria-label*="Send"]',
      'button:has(svg)'
    ],
    submitType: 'enter'
  },
  {
    id: 'yiyan',
    name: 'Wenxin Yiyan',
    url: 'https://yiyan.baidu.com/',
    host: 'yiyan.baidu.com',
    inputSelector: [
      'textarea',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    submitSelector: [
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'button:has(svg)'
    ],
    submitType: 'click'
  },
  {
    id: 'chatglm',
    name: 'ChatGLM',
    url: 'https://chatglm.cn/',
    host: 'chatglm.cn',
    inputSelector: [
      'textarea',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    submitSelector: [
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'button:has(svg)'
    ],
    submitType: 'click'
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    url: 'https://agent.minimaxi.com/',
    host: 'agent.minimaxi.com',
    inputSelector: [
      'textarea',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    submitSelector: [
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'button:has(svg)'
    ],
    submitType: 'click'
  }
];
