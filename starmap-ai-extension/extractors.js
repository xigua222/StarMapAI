(() => {
  const toText = (el) => {
    try {
      if (!el) return '';
      const t = (el.innerText || el.textContent || '');
      return String(t);
    } catch (e) {
      return '';
    }
  };

  const normalize = (text) => {
    const s = String(text || '');
    return s.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const uniqPush = (arr, seen, val) => {
    const v = normalize(val);
    if (!v) return;
    if (seen.has(v)) return;
    seen.add(v);
    arr.push(v);
  };

  const scoreChatCandidate = (el) => {
    try {
      if (!el || !el.getBoundingClientRect) return 0;
      const rect = el.getBoundingClientRect();
      if (rect.width < 240 || rect.height < 160) return 0;
      const t = normalize(toText(el));
      if (t.length < 200) return 0;
      const paragraphs = t.split('\n').filter(Boolean).length;
      const area = rect.width * rect.height;
      const scroll = Math.max(1, (el.scrollHeight || rect.height) / Math.max(1, el.clientHeight || rect.height));
      return Math.min(6, scroll) * (Math.min(10, paragraphs) + 1) * Math.min(400000, area);
    } catch (e) {
      return 0;
    }
  };

  const pickChatRoot = () => {
    const candidates = [];
    try {
      const mains = Array.from(document.querySelectorAll('main, [role="main"], .main, #main'));
      candidates.push(...mains);
    } catch (e) { }
    candidates.push(document.body);

    let best = null;
    let bestScore = 0;
    for (const el of candidates) {
      const score = scoreChatCandidate(el);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }

    try {
      const extra = Array.from(document.querySelectorAll('main, [role="main"], [class*="chat"], [class*="conversation"], [class*="messages"]')).slice(0, 40);
      for (const el of extra) {
        const score = scoreChatCandidate(el);
        if (score > bestScore) {
          bestScore = score;
          best = el;
        }
      }
    } catch (e) { }

    return best || document.body;
  };

  const extractByRoleAttribute = (root) => {
    const blocks = [];
    const seen = new Set();
    const nodes = Array.from(root.querySelectorAll('[data-message-author-role="user"], [data-message-author-role="assistant"], [data-message-author-role="system"]'));
    for (const node of nodes) {
      const role = node.getAttribute('data-message-author-role') || '';
      const txt = normalize(toText(node));
      if (!txt) continue;
      uniqPush(blocks, seen, `${role.toUpperCase()}:\n${txt}`);
    }
    return blocks;
  };

  const extractByCommonMessageBlocks = (root) => {
    const blocks = [];
    const seen = new Set();
    const selectors = [
      '[data-testid*="message"]',
      '[class*="message"]',
      '[class*="chat-message"]',
      '[class*="conversation"] [class*="turn"]',
      '[class*="markdown"]',
      'article',
      '[role="article"]'
    ];
    const nodes = [];
    for (const sel of selectors) {
      try {
        nodes.push(...Array.from(root.querySelectorAll(sel)));
      } catch (e) { }
      if (nodes.length > 250) break;
    }
    nodes.sort((a, b) => {
      try {
        const ap = a.compareDocumentPosition(b);
        if (ap & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (ap & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      } catch (e) { }
      return 0;
    });
    for (const node of nodes) {
      const txt = normalize(toText(node));
      if (!txt) continue;
      if (txt.length < 40) continue;
      uniqPush(blocks, seen, txt);
      if (blocks.length > 80) break;
    }
    return blocks;
  };

  const extractFallbackLargeText = (root) => {
    const t = normalize(toText(root));
    if (!t) return [];
    return [t];
  };

  const extractConversationText = (siteId) => {
    const root = pickChatRoot();
    let blocks = [];
    try {
      const byRole = extractByRoleAttribute(root);
      if (byRole.length >= 2) blocks = byRole;
    } catch (e) { }

    if (!blocks.length) {
      try {
        const byCommon = extractByCommonMessageBlocks(root);
        if (byCommon.length) blocks = byCommon;
      } catch (e) { }
    }

    if (!blocks.length) {
      blocks = extractFallbackLargeText(root);
    }

    const joined = normalize(blocks.join('\n\n'));
    return joined;
  };

  const splitToChunks = (text, chunkSize) => {
    const s = String(text || '');
    const size = Math.max(10000, Number(chunkSize) || 120000);
    const chunks = [];
    for (let i = 0; i < s.length; i += size) {
      chunks.push(s.slice(i, i + size));
    }
    return chunks.length ? chunks : [''];
  };

  window.AI_SYNCER_EXTRACTORS = {
    extractConversationText,
    splitToChunks
  };
})();
