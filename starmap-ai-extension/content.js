
const SITES = [
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

function getElementBySelectors(selectors) {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  
  for (const selector of selectorList) {
    let el = document.querySelector(selector);
    if (el) return el;
    
    el = deepQuerySelector(selector);
    if (el) return el;
  }
  return null;
}

function getElementsBySelectors(selectors) {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  const results = [];
  for (const selector of selectorList) {
    results.push(...Array.from(document.querySelectorAll(selector)));
    results.push(...deepQuerySelectorAll(selector));
  }
  const seen = new Set();
  const unique = [];
  for (const el of results) {
    if (!el || !el.tagName) continue;
    if (seen.has(el)) continue;
    seen.add(el);
    unique.push(el);
  }
  return unique;
}

function deepQuerySelector(selector, root = document) {
  if (root.matches && root.matches(selector)) return root;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    
    if (node.matches && node.matches(selector)) {
      return node;
    }
    
    if (node.shadowRoot) {
      const found = deepQuerySelector(selector, node.shadowRoot);
      if (found) return found;
    }
  }
  
  return null;
}

function deepQuerySelectorAll(selector, root = document) {
  const matches = [];
  if (root.querySelectorAll) {
    matches.push(...Array.from(root.querySelectorAll(selector)));
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: () => NodeFilter.FILTER_ACCEPT
    }
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.shadowRoot) {
      matches.push(...deepQuerySelectorAll(selector, node.shadowRoot));
    }
  }

  return matches;
}

function isProbablyVisible(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  return true;
}

function pickBestInputCandidate(candidates) {
  const usable = candidates.filter((el) => {
    if (!isProbablyVisible(el)) return false;
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input') {
      if (el.disabled) return false;
      if (el.readOnly) return false;
      return true;
    }
    if (el.isContentEditable) return true;
    return false;
  });
  if (usable.length === 0) return null;

  usable.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const ay = ar.top + ar.height / 2;
    const by = br.top + br.height / 2;
    if (Math.abs(by - ay) > 1) return by - ay;
    const aa = ar.width * ar.height;
    const ba = br.width * br.height;
    return ba - aa;
  });

  return usable[0] || null;
}

function findKimiInput() {
  const direct = getElementBySelectors([
    'div.chat-input-editor[data-lexical-editor="true"][role="textbox"]',
    'div.chat-input-editor[data-lexical-editor="true"]'
  ]);
  if (direct && isProbablyVisible(direct)) return direct;

  const candidates = getElementsBySelectors([
    '.chat-input-editor[data-lexical-editor="true"]',
    '.chat-input-editor',
    '[data-testid="chat-input"]',
    '#chat-input',
    'div[role="textbox"][contenteditable="true"]',
    'div[contenteditable="true"]',
    'textarea'
  ]);
  const usable = candidates.filter((el) => {
    if (!isProbablyVisible(el)) return false;
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input') {
      if (el.disabled || el.readOnly) return false;
      return true;
    }
    if (!el.isContentEditable) return false;
    if (el.getAttribute('data-lexical-editor') === 'true') return true;
    if (el.classList && el.classList.contains('chat-input-editor')) return true;
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    const dataPlaceholder = (el.getAttribute('data-placeholder') || '').toLowerCase();
    const okRole = role === 'textbox' || role === '';
    const okHint = aria.includes('输入') || aria.includes('说') || aria.includes('prompt') || dataPlaceholder.includes('输入') || dataPlaceholder.includes('说') || dataPlaceholder.includes('prompt');
    return okRole || okHint;
  });

  return pickBestInputCandidate(usable.length ? usable : candidates);
}

function findKimiTextareaNear(el) {
  if (!el) return null;
  const scopes = [];
  try {
    const form = el.closest ? el.closest('form') : null;
    if (form) scopes.push(form);
  } catch (e) { }
  let cur = el;
  for (let i = 0; i < 5; i++) {
    if (!cur || !cur.parentElement) break;
    cur = cur.parentElement;
    scopes.push(cur);
  }
  scopes.push(document);

  for (const scope of scopes) {
    const candidates = Array.from(scope.querySelectorAll('textarea')).filter((ta) => {
      if (!ta) return false;
      if (ta.disabled) return false;
      if (ta.readOnly) return false;
      return true;
    });
    if (candidates.length === 0) continue;
    const visible = candidates.filter(isProbablyVisible);
    if (visible.length) return pickBestInputCandidate(visible) || visible[0];
    return candidates[0] || null;
  }
  return null;
}

function getInputText(el) {
  if (!el) return '';
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'textarea' || tag === 'input') return String(el.value || '');
  if (el.isContentEditable) return String(el.innerText || el.textContent || '');
  return String(el.textContent || '');
}

function isLexicalEditor(el) {
  if (!el) return false;
  if (!el.isContentEditable) return false;
  if (el.getAttribute('data-lexical-editor') === 'true') return true;
  if (el.classList && el.classList.contains('chat-input-editor')) return true;
  return false;
}

function ensureEditableParagraph(el) {
  if (!el) return null;
  try {
    const p = el.querySelector('p');
    if (p) return p;
  } catch (e) { }
  try {
    const p = document.createElement('p');
    p.appendChild(document.createElement('br'));
    el.appendChild(p);
    return p;
  } catch (e) {
    return null;
  }
}

function placeCaretAtEnd(el) {
  if (!el) return false;
  try {
    const selection = window.getSelection();
    if (!selection) return false;
    const p = ensureEditableParagraph(el) || el;
    const range = document.createRange();
    range.selectNodeContents(p);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  } catch (e) {
    return false;
  }
}

function safeFocus(el) {
  if (!el) return;
  try {
    el.focus({ preventScroll: true });
    return;
  } catch (e) { }
  try {
    el.focus();
  } catch (e) { }
}

function clearContentEditable(el) {
  if (!el) return;
  try {
    safeFocus(el);
    const selection = window.getSelection();
    const range = document.createRange();
    if (isLexicalEditor(el)) {
      const p = ensureEditableParagraph(el);
      if (p) range.selectNodeContents(p);
      else range.selectNodeContents(el);
    } else {
      range.selectNodeContents(el);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('delete', false, null);
  } catch (e) { }
}

function clearInputElement(el) {
  if (!el) return;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'textarea' || tag === 'input') {
    try {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    } catch (e) { }
    return;
  }
  if (el.isContentEditable) {
    clearContentEditable(el);
  }
}

function dispatchBeforeInputWithType(element, data, inputType) {
  try {
    element.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType,
      data
    }));
  } catch (e) { }
}

async function tryInsertTextContentEditable(el, text) {
  try {
    if (!el) return false;
    safeFocus(el);
    simulateRealClick(el);
    clearContentEditable(el);
    if (!el.innerHTML || el.innerHTML.trim() === '') el.innerHTML = '<p><br></p>';
    placeCaretAtEnd(el);

    dispatchBeforeInputWithType(el, text, 'insertText');
    dispatchBeforeInputWithType(el, text, 'insertFromPaste');
    const ok = document.execCommand('insertText', false, text);
    if (ok) {
      try {
        el.dispatchEvent(new InputEvent('input', {
          bubbles: true,
          cancelable: false,
          composed: true,
          inputType: 'insertText',
          data: text
        }));
      } catch (e) { }
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      await new Promise(r => setTimeout(r, 80));
      const after = getInputText(el).trim();
      const key = String(text || '').slice(0, 6).trim();
      return key ? after.includes(key) : after.length > 0;
    }
    return false;
  } catch (e) {
    return false;
  }
}

async function tryPasteText(el, text) {
  try {
    if (!el) return false;
    safeFocus(el);
    simulateRealClick(el);
    clearContentEditable(el);

    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    const ev = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
      clipboardData: dt
    });
    el.dispatchEvent(ev);
    await new Promise(r => setTimeout(r, 30));
    {
      const after0 = getInputText(el).trim();
      const key0 = String(text || '').slice(0, 6).trim();
      const ok0 = key0 ? after0.includes(key0) : after0.length > 0;
      if (ok0) return true;
    }
    try {
      el.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        composed: true,
        inputType: 'insertFromPaste',
        data: text
      }));
    } catch (e) { }
    el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await new Promise(r => setTimeout(r, 50));
    const after = getInputText(el).trim();
    const key = String(text || '').slice(0, 6).trim();
    return key ? after.includes(key) : after.length > 0;
  } catch (e) {
    return false;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function forceSetContentEditable(el, text) {
  try {
    if (!el) return false;
    safeFocus(el);
    simulateRealClick(el);
    clearContentEditable(el);
    const html = `<p>${escapeHtml(text)}</p>`;
    el.innerHTML = html;
    dispatchBeforeInput(el, text);
    try {
      el.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        composed: true,
        inputType: 'insertReplacementText',
        data: text
      }));
    } catch (e) { }
    el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await new Promise(r => setTimeout(r, 50));
    const after = getInputText(el).trim();
    const key = String(text || '').slice(0, 6).trim();
    return key ? after.includes(key) : after.length > 0;
  } catch (e) {
    return false;
  }
}

function ensureKimiBridgeInstalled() {
  const hostname = window.location.hostname;
  if (!(hostname === 'kimi.com' || hostname.endsWith('.kimi.com'))) return;
  if (window.__ai_syncer_kimi_bridge_installed) return;
  window.__ai_syncer_kimi_bridge_installed = true;

  const script = document.createElement('script');
  script.id = 'ai-syncer-kimi-bridge';
  script.textContent = `(() => {
    if (window.__ai_syncer_kimi_bridge_active) return;
    window.__ai_syncer_kimi_bridge_active = true;

    const inputSelectors = [
      '.chat-input-editor[data-lexical-editor="true"]',
      '.chat-input-editor',
      'div[contenteditable="true"][data-lexical-editor="true"]',
      'div[role="textbox"][contenteditable="true"]',
      'div[contenteditable="true"]',
      '#chat-input',
      'textarea'
    ];

    const sendSelectors = [
      'button[type="submit"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="发送"]',
      '[data-testid="send-button"]',
      'button:has(svg)',
      'div[role="button"]:has(svg)',
      'div[class*="sendButton"]',
      '.send-button',
      'button[class*="sendButton"]'
    ];

    const pickFirst = (selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
      }
      return null;
    };

    const isVisible = (el) => {
      try {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
        const rect = el.getBoundingClientRect();
        return rect.width >= 2 && rect.height >= 2;
      } catch (e) {
        return true;
      }
    };

    const dispatchBeforeInput = (el, data, inputType) => {
      try {
        el.dispatchEvent(new InputEvent('beforeinput', {
          bubbles: true,
          cancelable: true,
          composed: true,
          inputType: inputType || 'insertText',
          data
        }));
      } catch (e) { }
    };

    const ensureParagraph = (el) => {
      if (!el) return null;
      try {
        const p = el.querySelector('p');
        if (p) return p;
      } catch (e) { }
      try {
        const p = document.createElement('p');
        p.appendChild(document.createElement('br'));
        el.appendChild(p);
        return p;
      } catch (e) {
        return null;
      }
    };

    const placeCaretAtEnd = (el) => {
      if (!el) return false;
      try {
        const sel = window.getSelection();
        if (!sel) return false;
        const p = ensureParagraph(el) || el;
        const range = document.createRange();
        range.selectNodeContents(p);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      } catch (e) {
        return false;
      }
    };

    const tryPasteText = (el, text) => {
      try {
        const dt = new DataTransfer();
        dt.setData('text/plain', String(text));
        dispatchBeforeInput(el, String(text), 'insertFromPaste');
        const ev = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          composed: true,
          clipboardData: dt
        });
        el.dispatchEvent(ev);
        try {
          el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } catch (e) { }
        const after0 = (el.innerText || el.textContent || '').trim();
        const key0 = String(text || '').slice(0, 6).trim();
        if (key0 ? after0.includes(key0) : after0.length > 0) return true;

        try {
          el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertFromPaste', data: String(text) }));
        } catch (e) { }

        const after1 = (el.innerText || el.textContent || '').trim();
        const key1 = String(text || '').slice(0, 6).trim();
        if (key1) return after1.includes(key1);
        return after1.length > 0;
      } catch (e) {
        return false;
      }
    };

    const setText = (el, text) => {
      if (!el) return false;
      try { el.focus(); } catch (e) { }
      try { el.click(); } catch (e) { }

      try {
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        document.execCommand('delete', false, null);
      } catch (e) { }

      let ok = false;
      try {
        ok = tryPasteText(el, text);
      } catch (e) { }

      if (!ok) {
        try {
          dispatchBeforeInput(el, String(text), 'insertText');
          placeCaretAtEnd(el);
          ok = document.execCommand('insertText', false, String(text));
        } catch (e) { }
      }

      if (!ok) {
        try {
          el.innerHTML = '<p><br></p>';
          placeCaretAtEnd(el);
          dispatchBeforeInput(el, String(text), 'insertText');
          ok = document.execCommand('insertText', false, String(text));
        } catch (e) { }
      }

      if (!ok) {
        try {
          el.innerHTML = '';
          const p = document.createElement('p');
          p.textContent = String(text);
          el.appendChild(p);
          ok = true;
        } catch (e) { }
      }

      try {
        el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: text }));
      } catch (e) { }
      try {
        el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      } catch (e) { }

      try {
        const after = (el.innerText || el.textContent || '').trim();
        const key = String(text || '').slice(0, 6).trim();
        if (key) return after.includes(key);
        return after.length > 0;
      } catch (e) {
        return ok;
      }
    };

    const clickSend = () => {
      let btn = null;
      for (const sel of sendSelectors) {
        const el = document.querySelector(sel);
        if (el && isVisible(el)) { btn = el; break; }
      }
      if (!btn) return false;
      if (btn.disabled) return false;
      if (btn.getAttribute && btn.getAttribute('aria-disabled') === 'true') return false;
      try { btn.click(); return true; } catch (e) { }
      try {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: window }));
        return true;
      } catch (e) { }
      return false;
    };

    window.addEventListener('message', (e) => {
      const msg = e && e.data;
      if (!msg || msg.type !== 'ai_syncer_kimi_bridge') return;
      const requestId = msg.requestId;
      const text = msg.text;
      const doSend = Boolean(msg.doSend);
      let ok = false;
      let sent = false;
      try {
        const input = pickFirst(inputSelectors);
        ok = setText(input, text);
        if (doSend) sent = clickSend();
      } catch (err) {
        ok = false;
        sent = false;
      }
      window.postMessage({ type: 'ai_syncer_kimi_bridge_result', requestId, ok, sent }, '*');
    });
  })();`;
  (document.documentElement || document.head || document.body).appendChild(script);
  script.remove();
}

function kimiBridgeFillAndSend(prompt, doSend) {
  const hostname = window.location.hostname;
  if (!(hostname === 'kimi.com' || hostname.endsWith('.kimi.com'))) return Promise.resolve({ ok: false, sent: false });
  ensureKimiBridgeInstalled();
  const requestId = `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve) => {
    let done = false;
    const onMessage = (e) => {
      const msg = e && e.data;
      if (!msg || msg.type !== 'ai_syncer_kimi_bridge_result') return;
      if (msg.requestId !== requestId) return;
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      resolve({ ok: Boolean(msg.ok), sent: Boolean(msg.sent) });
    };
    window.addEventListener('message', onMessage);
    window.postMessage({ type: 'ai_syncer_kimi_bridge', requestId, text: String(prompt || ''), doSend: Boolean(doSend) }, '*');
    setTimeout(() => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      resolve({ ok: false, sent: false });
    }, 1200);
  });
}

function isInputTextLikelyOk(inputEl, text) {
  const after = getInputText(inputEl).trim();
  const key = String(text || '').slice(0, 6).trim();
  if (key) return after.includes(key);
  return after.length > 0;
}

async function waitForElement(selectors, timeout = 10000) {
  const existing = getElementBySelectors(selectors);
  if (existing) return existing;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const intervalId = setInterval(() => {
      if (!chrome.runtime?.id) {
        clearInterval(intervalId);
        return; 
      }

      const el = getElementBySelectors(selectors);
      if (el) {
        clearInterval(intervalId);
        resolve(el);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        reject(new Error(`Timeout waiting for ${Array.isArray(selectors) ? selectors.join(' OR ') : selectors}`));
      }
    }, 500); // Check every 500ms
  });
}

function dispatchBeforeInput(element, data) {
  try {
    element.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType: 'insertText',
      data
    }));
  } catch (e) { }
}

function simulateRealClick(el) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const clientX = rect.left + Math.min(Math.max(rect.width / 2, 2), rect.width - 2);
  const clientY = rect.top + Math.min(Math.max(rect.height / 2, 2), rect.height - 2);
  const common = { bubbles: true, cancelable: true, composed: true, view: window, clientX, clientY };
  try { el.dispatchEvent(new PointerEvent('pointerdown', { ...common, pointerType: 'mouse', button: 0 })); } catch (e) { }
  el.dispatchEvent(new MouseEvent('mousedown', { ...common, button: 0 }));
  el.dispatchEvent(new MouseEvent('mouseup', { ...common, button: 0 }));
  el.dispatchEvent(new MouseEvent('click', { ...common, button: 0 }));
}

function pickBestButtonCandidate(candidates) {
  const usable = candidates.filter((el) => {
    if (!isProbablyVisible(el)) return false;
    const tag = (el.tagName || '').toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    if (tag !== 'button' && tag !== 'a' && role !== 'button') return false;
    if (el.disabled) return false;
    if (el.getAttribute('aria-disabled') === 'true') return false;
    return true;
  });

  if (usable.length === 0) return null;

  usable.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const ay = ar.top + ar.height / 2;
    const by = br.top + br.height / 2;
    if (Math.abs(by - ay) > 1) return by - ay;
    return (br.left + br.width / 2) - (ar.left + ar.width / 2);
  });

  return usable[0] || null;
}

function findBestButton(selectors) {
  const candidates = getElementsBySelectors(selectors);
  return pickBestButtonCandidate(candidates);
}

async function simulateTyping(element, text) {
  safeFocus(element);
  try { element.click(); } catch (e) { }

  const hostname = window.location.hostname;
  const isKimi = hostname === 'kimi.com' || hostname.endsWith('.kimi.com');

  const selection = window.getSelection();
  const range = document.createRange();
  if (isKimi && isLexicalEditor(element)) {
    const p = ensureEditableParagraph(element);
    if (p) range.selectNodeContents(p);
    else range.selectNodeContents(element);
  } else {
    range.selectNodeContents(element);
  }
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('delete', false, null);

  element.dispatchEvent(new CompositionEvent('compositionstart', {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    data: ''
  }));

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charCode = char.charCodeAt(0);
    
    dispatchBeforeInput(element, char);

    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: 'Key' + char.toUpperCase(), 
      keyCode: charCode,
      which: charCode,
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window
    }));

    element.dispatchEvent(new KeyboardEvent('keypress', {
      key: char,
      keyCode: charCode,
      which: charCode,
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window
    }));

    element.dispatchEvent(new CompositionEvent('compositionupdate', {
        bubbles: true,
        cancelable: false,
        composed: true,
        view: window,
        data: char
    }));

    let inserted = false;
    try {
      if (isKimi) {
        safeFocus(element);
        if (isLexicalEditor(element)) placeCaretAtEnd(element);
      }
      inserted = document.execCommand('insertText', false, char);
    } catch (e) { }

    if (!inserted) {
       const sel = window.getSelection();
       if (sel.rangeCount > 0) {
           const range = sel.getRangeAt(0);
           const textNode = document.createTextNode(char);
           range.deleteContents();
           range.insertNode(textNode);
           range.collapse(false);
           sel.removeAllRanges();
           sel.addRange(range);
       } else {
           element.appendChild(document.createTextNode(char));
       }
    }

    element.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: false,
      composed: true,
      inputType: 'insertText',
      data: char
    }));

    element.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      keyCode: charCode,
      which: charCode,
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window
    }));

    await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
  }

  element.dispatchEvent(new CompositionEvent('compositionend', {
    bubbles: true,
    cancelable: false,
    composed: true,
    view: window,
    data: text
  }));
  
  element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
}

async function setNativeValue(element, value) {
  const hostname = window.location.hostname;
  const isKimi = hostname === 'kimi.com' || hostname.endsWith('.kimi.com');
  const isTypingForced = isKimi ||
                         hostname.includes('doubao.com') ||
                         hostname.includes('claude.ai') ||
                         hostname.includes('yuanbao.tencent.com');

  if (element.isContentEditable) {
    safeFocus(element);
    
    if (isTypingForced) {
      if (hostname.includes('claude.ai')) {
        try {
          simulateRealClick(element);
          clearContentEditable(element);
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          dispatchBeforeInput(element, value);
          const ok = document.execCommand('insertText', false, value);
          if (ok) {
            element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            await new Promise(r => setTimeout(r, 50));
            const after = getInputText(element).trim();
            const key = String(value || '').slice(0, 6).trim();
            if (key ? after.includes(key) : after.length > 0) return;
          }
        } catch (e) { }

        const ok2 = await forceSetContentEditable(element, value);
        if (ok2) return;
        await simulateTyping(element, value);
        return;
      }

      if (isKimi && isLexicalEditor(element)) {
        const ok = await tryPasteText(element, value);
        if (ok) return;
        const ok3 = await tryInsertTextContentEditable(element, value);
        if (ok3) return;
        const ok2 = await forceSetContentEditable(element, value);
        if (ok2) return;
      }

      await simulateTyping(element, value);
      return;
    }
    
    try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        
        dispatchBeforeInput(element, value);
        const success = document.execCommand('insertText', false, value);
        
        if (!success) {
            throw new Error('execCommand failed');
        }
    } catch (e) {
        element.textContent = value;
        element.dispatchEvent(new InputEvent('input', { 
          bubbles: true, 
          inputType: 'insertText', 
          data: value,
          composed: true
        }));
    }
    
    element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    return;
  }

  dispatchBeforeInput(element, value);
  const lastValue = element.value;
  element.value = value;
  const event = new Event('input', { bubbles: true, composed: true });
  
  const tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  
  element.dispatchEvent(event);
  element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
}

function simulateEnterKey(element) {
  const events = [
    new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, composed: true, view: window }),
    new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, composed: true, view: window }),
    new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, composed: true, view: window })
  ];
  
  events.forEach(event => element.dispatchEvent(event));
}

function simulateCtrlEnterKey(element) {
  const events = [
    new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, ctrlKey: true, bubbles: true, cancelable: true, composed: true, view: window }),
    new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, ctrlKey: true, bubbles: true, cancelable: true, composed: true, view: window }),
    new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, ctrlKey: true, bubbles: true, cancelable: true, composed: true, view: window })
  ];
  events.forEach(event => element.dispatchEvent(event));
}

// Identify current site
function getCurrentSiteConfig() {
  const hostname = window.location.hostname;
  return SITES.find(site => hostname.includes(site.host));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'fill_and_send') {
    handleFillAndSend(msg.prompt, msg.siteConfig);
    sendResponse({ status: 'working' });
  } 
  else if (msg.action === 'gemini_upload_request') {
    try {
      const requestId = String(msg.requestId || '');
      if (!requestId) return;
      const config = getCurrentSiteConfig();
      if (!config || config.id !== 'gemini') return;
      const filename = String(msg.filename || 'starmap_outputs.md') || 'starmap_outputs.md';
      const total = Number(msg.total);
      const prompt = String(msg.prompt || '');
      if (!Number.isFinite(total) || total <= 0) return;

      window.__ai_syncer_gemini_upload = {
        requestId,
        filename,
        total,
        prompt,
        chunks: [],
        received: new Set()
      };

      chrome.runtime.sendMessage({ action: 'gemini_upload_ready', requestId });
    } catch (e) { }
    return;
  }
  else if (msg.action === 'gemini_upload_chunk') {
    try {
      const state = window.__ai_syncer_gemini_upload;
      if (!state) return;
      const requestId = String(msg.requestId || '');
      if (!requestId || requestId !== state.requestId) return;
      const index = Number(msg.index);
      const total = Number(msg.total);
      if (!Number.isFinite(index) || index < 0) return;
      if (!Number.isFinite(total) || total <= 0) return;
      if (total !== state.total) state.total = total;
      if (state.received.has(index)) return;

      state.received.add(index);
      state.chunks[index] = String(msg.chunk || '');

      if (state.received.size !== state.total) return;
      const markdown = state.chunks.map((c) => (c == null ? '' : String(c))).join('');
      geminiUploadMarkdownAndSummarize(markdown, state.filename, state.prompt, state.requestId);
    } catch (e) { }
    return;
  }
  else if (msg.action === 'collect_outputs') {
    try {
      const requestId = String(msg.requestId || '');
      if (!requestId) return;
      const config = getCurrentSiteConfig();
      if (!config) return;
      if (config.queryUrlTemplate) return;
      const targetSiteIds = Array.isArray(msg.targetSiteIds) ? msg.targetSiteIds : null;
      if (targetSiteIds && !targetSiteIds.includes(config.id)) return;

      const extractor = window.AI_SYNCER_EXTRACTORS;
      const text = extractor && typeof extractor.extractConversationText === 'function'
        ? extractor.extractConversationText(config.id)
        : '';
      const chunks = extractor && typeof extractor.splitToChunks === 'function'
        ? extractor.splitToChunks(text, 120000)
        : [String(text || '')];

      for (let i = 0; i < chunks.length; i++) {
        chrome.runtime.sendMessage({
          action: 'collect_outputs_chunk',
          requestId,
          siteId: config.id,
          siteName: config.name,
          url: window.location.href,
          index: i,
          total: chunks.length,
          chunk: chunks[i]
        });
      }
    } catch (e) { }
    return;
  }
  else if (msg.action === 'broadcast_prompt') {
    try {
      const broadcastId = msg && msg.broadcastId;
      if (broadcastId) {
        const seen = window.__ai_syncer_seen_broadcast_ids;
        if (seen && typeof seen.has === 'function' && seen.has(broadcastId)) return;
        if (!window.__ai_syncer_seen_broadcast_ids) window.__ai_syncer_seen_broadcast_ids = new Set();
        window.__ai_syncer_seen_broadcast_ids.add(broadcastId);
        if (window.__ai_syncer_seen_broadcast_ids.size > 20) {
          window.__ai_syncer_seen_broadcast_ids = new Set([broadcastId]);
        }
      }
    } catch (e) { }

    const config = getCurrentSiteConfig();
    if (config) {
      const targetSiteIds = Array.isArray(msg.targetSiteIds) ? msg.targetSiteIds : null;
      if (targetSiteIds && !targetSiteIds.includes(config.id)) return;
      console.log('[AI Syncer] Received broadcast for', config.name);
      handleFillAndSend(msg.prompt, config);
    } else {
        console.log('[AI Syncer] Script running on:', window.location.href);
    }
  }
});

async function findGeminiFileInput() {
  const inputs = getElementsBySelectors(['input[type="file"]']);
  const usable = inputs.filter((el) => {
    try {
      if (!el) return false;
      if (el.disabled) return false;
      return true;
    } catch (e) {
      return false;
    }
  });
  if (usable.length) return usable[0];

  const attachBtn = findBestButton([
    'button.upload-card-button',
    '.upload-card-button',
    'button[aria-label="打开文件上传菜单"]',
    'button[aria-label*="文件上传"]',
    'button[aria-label*="上传菜单"]',
    'button[aria-label*="Add files"]',
    'button[aria-label*="Add file"]',
    'button[aria-label*="Attach"]',
    'button[aria-label*="Upload"]',
    'button[aria-label*="File"]',
    'button[aria-label*="附件"]',
    'button[aria-label*="上传"]',
    '[data-testid*="attach"]',
    '[data-testid*="upload"]'
  ]);
  if (attachBtn) {
    simulateRealClick(attachBtn);
    await new Promise(r => setTimeout(r, 1200));
  }

  const inputs2 = getElementsBySelectors(['input[type="file"]']);
  const usable2 = inputs2.filter((el) => {
    try {
      if (!el) return false;
      if (el.disabled) return false;
      return true;
    } catch (e) {
      return false;
    }
  });
  return usable2[0] || null;
}

function createDragEvent(type, dataTransfer) {
  try {
    const ev = new DragEvent(type, { bubbles: true, cancelable: true, composed: true });
    if (dataTransfer) {
      try {
        Object.defineProperty(ev, 'dataTransfer', { value: dataTransfer });
      } catch (e) { }
    }
    return ev;
  } catch (e) {
    const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
    if (dataTransfer) {
      try {
        Object.defineProperty(ev, 'dataTransfer', { value: dataTransfer });
      } catch (err) { }
    }
    return ev;
  }
}

async function waitForTextAppear(text, timeoutMs = 8000) {
  const key = String(text || '').trim();
  if (!key) return false;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const bodyText = (document.body && (document.body.innerText || document.body.textContent)) || '';
      if (String(bodyText).includes(key)) return true;
    } catch (e) { }
    await new Promise(r => setTimeout(r, 300));
  }
  return false;
}

async function tryGeminiUploadViaInput(markdown, filename) {
  try {
    const attachBtn = findBestButton([
      'button.upload-card-button',
      '.upload-card-button',
      'button[aria-label="打开文件上传菜单"]',
      'button[aria-label*="文件上传"]',
      'button[aria-label*="上传菜单"]'
    ]);
    if (attachBtn) {
      simulateRealClick(attachBtn);
      await new Promise(r => setTimeout(r, 900));
    }
  } catch (e) { }

  const input = await findGeminiFileInput();
  if (!input) return false;
  const file = new File([String(markdown || '')], String(filename || 'starmap_outputs.md'), { type: 'text/markdown' });
  const dt = new DataTransfer();
  dt.items.add(file);
  let okSet = false;
  try {
    input.files = dt.files;
    okSet = true;
  } catch (e) { }
  try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
  try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
  if (!okSet) return false;
  const appeared = await waitForTextAppear(file.name, 7000);
  return appeared || true;
}

async function tryGeminiUploadViaDrop(markdown, filename, config) {
  const file = new File([String(markdown || '')], String(filename || 'starmap_outputs.md'), { type: 'text/markdown' });
  const dt = new DataTransfer();
  dt.items.add(file);
  let target = null;
  try {
    const uploadBtn = findBestButton([
      'button.upload-card-button',
      '.upload-card-button',
      'button[aria-label="打开文件上传菜单"]'
    ]);
    if (uploadBtn) simulateRealClick(uploadBtn);
  } catch (e) { }
  try {
    target = await waitForElement(config.inputSelector, 5000);
  } catch (e) { }
  if (!target) {
    target = getElementBySelectors(['main', '[role="main"]', 'body']) || document.body;
  }
  try {
    target.dispatchEvent(createDragEvent('dragenter', dt));
    target.dispatchEvent(createDragEvent('dragover', dt));
    target.dispatchEvent(createDragEvent('drop', dt));
  } catch (e) { }
  const appeared = await waitForTextAppear(file.name, 7000);
  return appeared;
}

async function geminiUploadMarkdownAndSummarize(markdown, filename, prompt, requestId) {
  try {
    const config = getCurrentSiteConfig();
    if (!config || config.id !== 'gemini') {
      chrome.runtime.sendMessage({ action: 'gemini_upload_done', requestId, ok: false });
      return;
    }

    let uploaded = false;
    try {
      uploaded = await tryGeminiUploadViaInput(markdown, filename);
    } catch (e) { }

    if (!uploaded) {
      try {
        uploaded = await tryGeminiUploadViaDrop(markdown, filename, config);
      } catch (e) { }
    }

    await new Promise(r => setTimeout(r, 900));
    await handleFillAndSend(String(prompt || ''), config);
    chrome.runtime.sendMessage({ action: 'gemini_upload_done', requestId, ok: Boolean(uploaded) });
  } catch (e) { }
}

function postWheelDeltaToParent(deltaX, deltaY, deltaMode, shiftKey) {
  try {
    window.parent.postMessage({ type: 'ai_syncer_hscroll', deltaX, deltaY, deltaMode, shiftKey }, '*');
  } catch (e) { }
}

function setupWheelPassthrough() {
  if (window.top === window) return;
  window.addEventListener('wheel', (e) => {
    try {
      if (e.defaultPrevented) return;
      const dx = e.deltaX;
      const dy = e.deltaY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 0.01 && absY < 0.01) return;
      const wantsHorizontal = absX > absY;
      const wantsShiftHorizontal = e.shiftKey && absY > absX;
      if (!wantsHorizontal && !wantsShiftHorizontal) return;

      const wantsDown = dy > 0;
      const wantsUp = dy < 0;
      const path = (typeof e.composedPath === 'function' ? e.composedPath() : []);
      const candidates = Array.isArray(path) ? path : [];
      const scrollable = candidates.find((node) => {
        if (!node || !node.tagName) return false;
        const tag = String(node.tagName).toLowerCase();
        if (tag === 'html' || tag === 'body') return false;
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false;
        return node.scrollHeight > node.clientHeight + 2;
      }) || (document.scrollingElement || document.documentElement);

      const canScroll = scrollable && scrollable.scrollHeight > scrollable.clientHeight + 2;
      const atTop = !scrollable || scrollable.scrollTop <= 0;
      const atBottom = !scrollable || (scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1);
      const shouldPassthrough = !canScroll || (wantsDown && atBottom) || (wantsUp && atTop);
      if (!shouldPassthrough) return;
      postWheelDeltaToParent(dx, dy, e.deltaMode, e.shiftKey);
      e.preventDefault();
    } catch (err) { }
  }, { passive: false });
}

setupWheelPassthrough();

async function handleFillAndSend(prompt, config) {
  try {
    let inputEl;
    if (config.id === 'kimi') {
      await waitForElement(config.inputSelector);
      inputEl = findKimiInput() || await waitForElement(config.inputSelector);
    } else if (config.id === 'claude') {
      await waitForElement(config.inputSelector);
      inputEl = pickBestInputCandidate(getElementsBySelectors(config.inputSelector)) || await waitForElement(config.inputSelector);
    } else {
      inputEl = await waitForElement(config.inputSelector);
    }
    
    safeFocus(inputEl);

    if (config.id === 'kimi') {
      const ta = findKimiTextareaNear(inputEl);
      if (ta) {
        clearInputElement(ta);
        await setNativeValue(ta, prompt);
        await new Promise(r => setTimeout(r, 120));
        const afterTa = getInputText(ta).trim();
        const keyTa = String(prompt || '').slice(0, 6).trim();
        const okTa = keyTa ? afterTa.includes(keyTa) : afterTa.length > 0;
        if (okTa) {
          inputEl = ta;
        }
      }
    }

    clearInputElement(inputEl);
    await setNativeValue(inputEl, prompt);
    
    await new Promise(r => setTimeout(r, 500));

    if (config.id === 'kimi') {
      let ok = isInputTextLikelyOk(inputEl, prompt);
      if (!ok) {
        const alt = pickBestInputCandidate(getElementsBySelectors(['textarea']));
        if (alt && alt !== inputEl) {
          safeFocus(alt);
          await setNativeValue(alt, prompt);
          await new Promise(r => setTimeout(r, 300));
          inputEl = alt;
          ok = isInputTextLikelyOk(inputEl, prompt);
        }
      }

      if (!ok) {
        const bridgeRes = await kimiBridgeFillAndSend(prompt, false);
        await new Promise(r => setTimeout(r, 250));
        const refreshed = findKimiInput();
        if (refreshed) inputEl = refreshed;
        ok = bridgeRes.ok || isInputTextLikelyOk(inputEl, prompt);
      }

      if (!ok) {
        await kimiBridgeFillAndSend(prompt, true);
        console.log(`[AI Syncer] Sent to ${config.name}`);
        return;
      }
    }

    let submitBtn = null;
    if (config.submitSelector) {
      await waitForElement(config.submitSelector, 2000).catch(() => null);
      submitBtn = findBestButton(config.submitSelector);
    }

    if (submitBtn) {
      simulateRealClick(submitBtn);
      if (config.id === 'yuanbao') {
        await new Promise(r => setTimeout(r, 200));
        simulateEnterKey(inputEl);
        await new Promise(r => setTimeout(r, 200));
        simulateCtrlEnterKey(inputEl);
      }
    } else if (config.submitType === 'enter') {
      if (config.id === 'deepseek') await new Promise(r => setTimeout(r, 500));
      simulateEnterKey(inputEl);
    } else {
      simulateEnterKey(inputEl);
      if (config.id === 'yuanbao') {
        await new Promise(r => setTimeout(r, 200));
        simulateCtrlEnterKey(inputEl);
      }
    }

    if (config.id === 'kimi') {
      await new Promise(r => setTimeout(r, 700));
      const remaining = getInputText(inputEl).trim();
      if (remaining.length > 0) {
        await kimiBridgeFillAndSend(prompt, true);
      }
    }
    
    console.log(`[AI Syncer] Sent to ${config.name}`);
    
  } catch (err) {
    console.error(`[AI Syncer] Error on ${config.name}:`, err);
  }
}
