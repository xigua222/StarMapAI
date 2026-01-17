import { SITES } from './sites.js';

const grid = document.getElementById('grid');
const topBar = document.getElementById('topBar');
const topBarChips = document.getElementById('topBarChips');
const topFocusFrame = document.getElementById('topFocusFrame');
const promptInput = document.getElementById('promptInput');
const promptClearBtn = document.getElementById('promptClearBtn');
const sendBtn = document.getElementById('sendBtn');
const refreshBtn = document.getElementById('refreshBtn');
const saveOutputsBtn = document.getElementById('saveOutputsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const scrollRange = document.getElementById('scrollRange');
const brand = document.getElementById('brand');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const aiCheckboxes = document.getElementById('aiCheckboxes');
const searchCheckboxes = document.getElementById('searchCheckboxes');
const controlsPanel = document.getElementById('controlsPanel');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfoBtn');

const GRID_SCROLL_LEFT_KEY = 'gridScrollLeft';

// Load saved selection or default to all
const DEFAULT_SELECTED = SITES.map(s => s.id);
let selectedSiteIds = JSON.parse(localStorage.getItem('selectedSites')) || DEFAULT_SELECTED;
let frozenSiteIds = new Set();
let draggingSiteId = null;
let draggingOrder = null;
let scrollLockRaf = 0;
let collectRequestId = '';
let collectExpectedSiteIds = [];
let collectChunksBySite = new Map();
let collectTimeoutId = 0;
let collectMode = 'download';
let geminiUpload = null;

// Ensure selected IDs are valid (in case SITES changed)
selectedSiteIds = selectedSiteIds.filter(id => SITES.find(s => s.id === id));
if (selectedSiteIds.length === 0) selectedSiteIds = DEFAULT_SELECTED;

function init() {
  renderGrid();
  renderTopBar();
  setupSettings();
  setupScrollControls();
  setupTopBarDnD();
  setupTopBarFocusFrameTracking();
  setupWheelHorizontalScroll();
  setupIframeWheelBridge();
  setupCollectOutputs();
  setupSaveOutputs();
  setupInfoModal();
  setupPromptWheelScroll();
  setupPromptClear();
  setupPageVisibilityHandlers();
}

function isSearchSite(site) {
  if (!site) return false;
  return site.type === 'search' || Boolean(site.queryUrlTemplate);
}

function sanitizeFilename(s) {
  return String(s || '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function formatNowForFilename() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function downloadText(filename, content) {
  const blob = new Blob([String(content || '')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function splitToChunks(text, chunkSize) {
  const s = String(text || '');
  const size = Math.max(10000, Number(chunkSize) || 120000);
  const chunks = [];
  for (let i = 0; i < s.length; i += size) {
    chunks.push(s.slice(i, i + size));
  }
  return chunks.length ? chunks : [''];
}

function buildOutputsMarkdown(resultsBySiteId) {
  const lines = [];
  lines.push(`# StarMap AI 导出`);
  lines.push(`- 时间：${new Date().toLocaleString()}`);
  lines.push('');
  for (const siteId of collectExpectedSiteIds) {
    const r = resultsBySiteId.get(siteId);
    const name = r?.siteName || siteId;
    const url = r?.url || '';
    lines.push(`## ${name}${url ? ` (${url})` : ''}`);
    lines.push('');
    const text = String(r?.text || '').trim();
    if (!text) {
      lines.push(`(未获取到内容)`);
      lines.push('');
      continue;
    }
    lines.push('```');
    lines.push(text);
    lines.push('```');
    lines.push('');
  }
  return lines.join('\n');
}

function getCollectedOutputsMarkdown() {
  const bySite = new Map();
  for (const siteId of collectExpectedSiteIds) {
    const entry = collectChunksBySite.get(siteId);
    if (!entry) continue;
    const chunks = Array.isArray(entry.chunks) ? entry.chunks : [];
    const assembled = chunks.map((c) => (c == null ? '' : String(c))).join('');
    bySite.set(siteId, { siteName: entry.siteName, url: entry.url, text: assembled });
  }
  return buildOutputsMarkdown(bySite);
}

function endCollectUi() {
  collectRequestId = '';
  collectExpectedSiteIds = [];
  collectChunksBySite = new Map();
  if (collectTimeoutId) {
    clearTimeout(collectTimeoutId);
    collectTimeoutId = 0;
  }
  if (saveOutputsBtn) {
    saveOutputsBtn.disabled = false;
    saveOutputsBtn.title = '保存输出（不含搜索引擎）';
  }
}

function finalizeCollectOutputs() {
  const content = getCollectedOutputsMarkdown();
  if (collectMode === 'summarize') {
    const filename = sanitizeFilename(`starmap_outputs_${formatNowForFilename()}.md`);
    downloadText(filename, content);
    openGeminiForSummary(content);
  } else {
    const filename = sanitizeFilename(`starmap_outputs_${formatNowForFilename()}.md`);
    downloadText(filename, content);
  }
  endCollectUi();
}

function tryFinalizeIfComplete() {
  if (!collectRequestId) return;
  for (const siteId of collectExpectedSiteIds) {
    const entry = collectChunksBySite.get(siteId);
    if (!entry) return;
    if (!Number.isFinite(entry.total) || entry.total <= 0) return;
    if (entry.receivedCount !== entry.total) return;
  }
  finalizeCollectOutputs();
}

function setupCollectOutputs() {
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.action !== 'collect_outputs_chunk') return;
    if (!collectRequestId) return;
    if (msg.requestId !== collectRequestId) return;
    const siteId = String(msg.siteId || '');
    if (!siteId) return;
    if (!collectExpectedSiteIds.includes(siteId)) return;
    const index = Number(msg.index);
    const total = Number(msg.total);
    if (!Number.isFinite(index) || index < 0) return;
    if (!Number.isFinite(total) || total <= 0) return;
    const chunk = String(msg.chunk || '');

    let entry = collectChunksBySite.get(siteId);
    if (!entry) {
      entry = { siteName: String(msg.siteName || siteId), url: String(msg.url || ''), total, chunks: [], received: new Set(), receivedCount: 0 };
      collectChunksBySite.set(siteId, entry);
    }
    entry.siteName = String(msg.siteName || entry.siteName || siteId);
    entry.url = String(msg.url || entry.url || '');
    entry.total = total;
    if (!entry.received.has(index)) {
      entry.received.add(index);
      entry.receivedCount = entry.received.size;
      entry.chunks[index] = chunk;
    }
    tryFinalizeIfComplete();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.action !== 'gemini_upload_ready') return;
    if (!geminiUpload) return;
    if (msg.requestId !== geminiUpload.requestId) return;
    if (geminiUpload.ready) return;
    geminiUpload.ready = true;
    sendGeminiUploadChunks();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.action !== 'gemini_upload_done') return;
    if (!geminiUpload) return;
    if (msg.requestId !== geminiUpload.requestId) return;
    geminiUpload = null;
  });
}

function startCollect(mode) {
  const activeSites = getActiveSites();
  const targets = activeSites.filter((s) => !isSearchSite(s)).map((s) => s.id);
  if (targets.length === 0) return;
  collectMode = mode === 'summarize' ? 'summarize' : 'download';
  collectRequestId = `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  collectExpectedSiteIds = targets.slice();
  collectChunksBySite = new Map();

  if (saveOutputsBtn) {
    saveOutputsBtn.disabled = true;
    saveOutputsBtn.title = '正在收集...';
  }

  if (collectTimeoutId) clearTimeout(collectTimeoutId);
  collectTimeoutId = setTimeout(() => {
    finalizeCollectOutputs();
  }, 12000);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs && tabs[0] ? tabs[0].id : null;
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { action: 'collect_outputs', requestId: collectRequestId, targetSiteIds: targets });
  });
}

function setupSaveOutputs() {
  if (!saveOutputsBtn) return;
  saveOutputsBtn.addEventListener('click', () => startCollect('download'));
}

function buildGeminiSummaryPrompt(markdown) {
  return [
    '我上传了一个 Markdown 文件，里面是多个模型对同一轮输入的回答汇总。',
    '请读取该文件并完成：',
    '1) 总结共同点（结论一致的部分）',
    '2) 找出不同点与分歧点（观点冲突/结论不同/假设不同）',
    '3) 给出你综合后的最终建议/最终答案（说明取舍理由）'
  ].join('\n');
}

function sendGeminiUploadRequest() {
  if (!geminiUpload) return;
  chrome.tabs.sendMessage(geminiUpload.tabId, {
    action: 'gemini_upload_request',
    requestId: geminiUpload.requestId,
    filename: geminiUpload.filename,
    total: geminiUpload.chunks.length,
    prompt: geminiUpload.prompt
  });
}

function sendGeminiUploadChunks() {
  if (!geminiUpload) return;
  if (geminiUpload.sent) return;
  geminiUpload.sent = true;
  for (let i = 0; i < geminiUpload.chunks.length; i++) {
    const delay = Math.min(12000, i * 18);
    setTimeout(() => {
      if (!geminiUpload) return;
      chrome.tabs.sendMessage(geminiUpload.tabId, {
        action: 'gemini_upload_chunk',
        requestId: geminiUpload.requestId,
        index: i,
        total: geminiUpload.chunks.length,
        chunk: geminiUpload.chunks[i]
      });
    }, delay);
  }
}

function openGeminiForSummary(markdown) {
  const url = 'https://gemini.google.com/app';
  const prompt = buildGeminiSummaryPrompt();
  const filename = sanitizeFilename(`starmap_outputs_${formatNowForFilename()}.md`);
  const chunks = splitToChunks(markdown, 120000);
  chrome.tabs.create({ url }, (tab) => {
    const tabId = tab && tab.id;
    if (!tabId) return;
    geminiUpload = {
      tabId,
      requestId: `gup_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      filename,
      prompt,
      chunks,
      ready: false,
      sent: false
    };

    const delays = [1400, 2800, 5200];
    delays.forEach((delay) => {
      setTimeout(() => {
        if (!geminiUpload) return;
        sendGeminiUploadRequest();
      }, delay);
    });

    setTimeout(() => {
      if (!geminiUpload) return;
      if (geminiUpload.ready) return;
      sendGeminiUploadRequest();
      sendGeminiUploadChunks();
    }, 9000);
  });
}

function setupInfoModal() {
  const open = () => {
    if (!infoModal) return;
    infoModal.classList.add('open');
  };
  const close = () => {
    if (!infoModal) return;
    infoModal.classList.remove('open');
  };
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open();
    });
  }
  if (closeInfoBtn) closeInfoBtn.addEventListener('click', close);
  if (infoModal) {
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) close();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function getStoredGridScrollLeft() {
  const raw = localStorage.getItem(GRID_SCROLL_LEFT_KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function persistGridScrollLeft(left) {
  const n = Number(left);
  if (!Number.isFinite(n) || n < 0) return;
  localStorage.setItem(GRID_SCROLL_LEFT_KEY, String(Math.round(n)));
}

function stopScrollLock() {
  if (!scrollLockRaf) return;
  cancelAnimationFrame(scrollLockRaf);
  scrollLockRaf = 0;
}

function setupPageVisibilityHandlers() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopScrollLock();
      persistGridScrollLeft(grid.scrollLeft);
    } else {
      requestAnimationFrame(() => {
        setScrollRangeMax();
        const max = Math.max(0, grid.scrollWidth - grid.clientWidth);
        const restored = Math.max(0, Math.min(getStoredGridScrollLeft(), max));
        if (Math.abs(grid.scrollLeft - restored) > 1) {
          grid.scrollLeft = restored;
        }
        scrollRange.value = String(grid.scrollLeft);
        updateTopFocusFrame();
      });
    }
  });
}

function setupPromptClear() {
  const update = () => {
    const hasText = Boolean(promptInput.value && promptInput.value.trim().length > 0);
    promptClearBtn.style.display = hasText ? 'inline-flex' : 'none';
    // Ensure padding prevents text from being hidden behind the button
    // But don't override the larger padding from hover/focus states if possible
    // Actually, inline style overrides. Let's just set it to a safe value if has text.
    // The CSS has 44px on hover/focus. 36px is enough for button.
    // If we want to respect CSS hover, we should use a class.
    // But for simplicity, let's just ensure it's not covered.
    // We can check if it's focused? No.
    // Let's just set a class on the wrapper and let CSS handle it would be best,
    // but we can't easily edit CSS without big replace.
    // Let's just set paddingRight inline to '40px' when has text.
    promptInput.style.paddingRight = hasText ? '40px' : '';
  };
  promptInput.addEventListener('input', update);
  promptInput.addEventListener('blur', update);
  promptInput.addEventListener('focus', update);
  promptClearBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.focus();
    update();
  });
  update();
}

function setupTopBarFocusFrameTracking() {
  topBar.addEventListener('mouseenter', () => updateTopFocusFrame());
  topBar.addEventListener('mousemove', () => updateTopFocusFrame());
  topBar.addEventListener('mouseleave', () => updateTopFocusFrame());
  topBar.addEventListener('transitionend', () => updateTopFocusFrame());
}

function setupWheelHorizontalScroll() {
  grid.addEventListener('wheel', (e) => {
    if (scrollLockRaf) stopScrollLock();
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX < 0.01 && absY < 0.01) return;

    const unit = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 40 : (e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? grid.clientWidth : 1);
    const dx = e.deltaX * unit;
    const dy = e.deltaY * unit;
    const wantsHorizontal = absX > absY;
    const wantsShiftHorizontal = e.shiftKey && absY > absX;
    if (!wantsHorizontal && !wantsShiftHorizontal) return;
    const delta = wantsHorizontal ? dx : dy;
    grid.scrollLeft += delta * 2.8;
    persistGridScrollLeft(grid.scrollLeft);
    e.preventDefault();
  }, { passive: false });
}

function setupPromptWheelScroll() {
  if (!controlsPanel || !promptInput) return;
  promptInput.addEventListener('wheel', (e) => {
    if (!(controlsPanel.matches(':hover') || controlsPanel.matches(':focus-within'))) return;
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX < 0.01 && absY < 0.01) return;
    if (scrollLockRaf) stopScrollLock();

    const unit = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 40 : (e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? grid.clientWidth : 1);
    const dx = e.deltaX * unit;
    const dy = e.deltaY * unit;
    const delta = absX > absY ? dx : dy;
    grid.scrollLeft += delta * 2.8;
    scrollRange.value = String(grid.scrollLeft);
    updateTopFocusFrame();
    persistGridScrollLeft(grid.scrollLeft);
    e.preventDefault();
  }, { passive: false });
}

function setupIframeWheelBridge() {
  window.addEventListener('message', (e) => {
    const data = e.data;
    if (!data || data.type !== 'ai_syncer_hscroll') return;
    const deltaX = Number(data.deltaX || 0);
    const deltaY = Number(data.deltaY || 0);
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX < 0.01 && absY < 0.01) return;
    if (scrollLockRaf) stopScrollLock();

    const unit = data.deltaMode === WheelEvent.DOM_DELTA_LINE ? 40 : (data.deltaMode === WheelEvent.DOM_DELTA_PAGE ? grid.clientWidth : 1);
    const dx = deltaX * unit;
    const dy = deltaY * unit;
    const wantsHorizontal = absX > absY;
    const wantsShiftHorizontal = Boolean(data.shiftKey) && absY > absX;
    if (!wantsHorizontal && !wantsShiftHorizontal) return;
    const delta = wantsHorizontal ? dx : dy;
    grid.scrollLeft += delta * 2.8;
    scrollRange.value = String(grid.scrollLeft);
    updateTopFocusFrame();
    persistGridScrollLeft(grid.scrollLeft);
  });
}

function persistSelectedSites() {
  localStorage.setItem('selectedSites', JSON.stringify(selectedSiteIds));
}

function getActiveSites() {
  return SITES.filter(site => selectedSiteIds.includes(site.id));
}

function getSiteById(siteId) {
  return SITES.find(s => s.id === siteId) || null;
}

function normalizeSelectionOrder(checkedIds) {
  const checkedSet = new Set(checkedIds);
  const order = [];
  selectedSiteIds.forEach(id => {
    if (checkedSet.has(id)) order.push(id);
  });
  SITES.forEach(site => {
    if (checkedSet.has(site.id) && !order.includes(site.id)) order.push(site.id);
  });
  return order;
}

function applyOrderStyles(order) {
  const orderMap = new Map(order.map((id, idx) => [id, idx]));
  grid.querySelectorAll('.iframe-container[data-site-id]').forEach((el) => {
    const id = el.dataset.siteId;
    const idx = orderMap.get(id);
    el.style.order = String(idx ?? 9999);
  });
  topBarChips.querySelectorAll('.site-chip[data-site-id]').forEach((el) => {
    const id = el.dataset.siteId;
    const idx = orderMap.get(id);
    el.style.order = String(idx ?? 9999);
  });
}

function removeSiteDom(siteId) {
  frozenSiteIds.delete(siteId);
  const container = grid.querySelector(`.iframe-container[data-site-id="${siteId}"]`);
  if (container) container.remove();
  const chip = topBarChips.querySelector(`.site-chip[data-site-id="${siteId}"]`);
  if (chip) chip.remove();
}

function addSiteDom(siteId) {
  const site = getSiteById(siteId);
  if (!site) return;
  if (!grid.querySelector(`.iframe-container[data-site-id="${siteId}"]`)) {
    grid.appendChild(createTile(site));
  }
  if (!topBarChips.querySelector(`.site-chip[data-site-id="${siteId}"]`)) {
    topBarChips.appendChild(createChip(site));
  }
}

function applySelection(newSelectedIds) {
  if (!Array.isArray(newSelectedIds) || newSelectedIds.length === 0) return;

  const next = newSelectedIds.filter(id => getSiteById(id));
  if (next.length === 0) return;

  const prevScrollLeft = grid.scrollLeft;
  const currentSet = new Set(selectedSiteIds);
  const nextSet = new Set(next);

  selectedSiteIds.forEach(id => {
    if (!nextSet.has(id)) removeSiteDom(id);
  });

  next.forEach(id => {
    if (!currentSet.has(id)) addSiteDom(id);
  });

  applyOrderStyles(next);

  selectedSiteIds = next;
  persistSelectedSites();
  populateSettings();
  requestAnimationFrame(() => {
    grid.scrollLeft = prevScrollLeft;
    setScrollRangeMax();
  });
}

function removeSite(siteId) {
  if (selectedSiteIds.length <= 1) return;
  selectedSiteIds = selectedSiteIds.filter(id => id !== siteId);
  frozenSiteIds.delete(siteId);
  persistSelectedSites();
  removeSiteDom(siteId);
  applyOrderStyles(selectedSiteIds);
  requestAnimationFrame(() => setScrollRangeMax());
  populateSettings();
}

function toggleFreeze(siteId) {
  if (frozenSiteIds.has(siteId)) {
    frozenSiteIds.delete(siteId);
  } else {
    frozenSiteIds.add(siteId);
  }
  const container = grid.querySelector(`.iframe-container[data-site-id="${siteId}"]`);
  if (container) {
    container.classList.toggle('frozen', frozenSiteIds.has(siteId));
    const btn = container.querySelector('.label-btn[data-action="freeze"]');
    if (btn) btn.setAttribute('aria-pressed', frozenSiteIds.has(siteId) ? 'true' : 'false');
  }
}

function clearFrozen() {
  if (frozenSiteIds.size === 0) return;
  frozenSiteIds = new Set();
  grid.querySelectorAll('.iframe-container.frozen').forEach(el => el.classList.remove('frozen'));
  grid.querySelectorAll('.label-btn[data-action="freeze"]').forEach(el => el.setAttribute('aria-pressed', 'false'));
}

function lockGridScroll(durationMs = 1200) {
  if (scrollLockRaf) {
    cancelAnimationFrame(scrollLockRaf);
    scrollLockRaf = 0;
  }
  const lockedLeft = grid.scrollLeft;
  const start = performance.now();
  const tick = () => {
    if (performance.now() - start > durationMs) {
      scrollLockRaf = 0;
      return;
    }
    if (grid.scrollLeft !== lockedLeft) {
      grid.scrollLeft = lockedLeft;
    }
    scrollRange.value = String(lockedLeft);
    updateTopFocusFrame();
    scrollLockRaf = requestAnimationFrame(tick);
  };
  scrollLockRaf = requestAnimationFrame(tick);
}

function setScrollRangeMax() {
  const max = Math.max(0, grid.scrollWidth - grid.clientWidth);
  scrollRange.max = String(max);
  scrollRange.value = String(Math.min(Number(scrollRange.value || '0'), max));
  updateTopFocusFrame();
}

function getFocusedSiteId() {
  const tiles = [...grid.querySelectorAll('.iframe-container[data-site-id]')];
  if (tiles.length === 0) return null;
  const targetX = grid.scrollLeft + grid.clientWidth / 2;
  let bestId = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const tile of tiles) {
    const id = tile.dataset.siteId;
    const center = tile.offsetLeft + tile.clientWidth / 2;
    const dist = Math.abs(center - targetX);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = id;
    }
  }
  return bestId;
}

function getVisibleSiteIds() {
  const tiles = [...grid.querySelectorAll('.iframe-container[data-site-id]')];
  if (tiles.length === 0) return [];
  const leftBound = grid.scrollLeft;
  const rightBound = leftBound + grid.clientWidth;
  return tiles
    .filter((tile) => {
      const left = tile.offsetLeft;
      const right = left + tile.clientWidth;
      return right > leftBound && left < rightBound;
    })
    .map(tile => tile.dataset.siteId)
    .filter(Boolean);
}

function updateTopFocusFrame() {
  if (!topFocusFrame) return;
  const visibleIds = getVisibleSiteIds();
  const targetIds = visibleIds.length > 0 ? visibleIds : (getFocusedSiteId() ? [getFocusedSiteId()] : []);
  if (targetIds.length === 0) {
    topFocusFrame.style.opacity = '0';
    return;
  }

  const barRect = topBar.getBoundingClientRect();
  const chipRects = targetIds
    .map(id => topBarChips.querySelector(`.site-chip[data-site-id="${id}"]`))
    .filter(Boolean)
    .map(el => el.getBoundingClientRect());
  if (chipRects.length === 0) {
    topFocusFrame.style.opacity = '0';
    return;
  }

  const scaleX = topBar.offsetWidth ? (barRect.width / topBar.offsetWidth) : 1;
  const scaleY = topBar.offsetHeight ? (barRect.height / topBar.offsetHeight) : 1;
  const safeScaleX = scaleX || 1;
  const safeScaleY = scaleY || 1;

  const minLeft = Math.min(...chipRects.map(r => r.left));
  const maxRight = Math.max(...chipRects.map(r => r.right));
  const minTop = Math.min(...chipRects.map(r => r.top));
  const maxBottom = Math.max(...chipRects.map(r => r.bottom));

  const isCompact = safeScaleX < 0.92 || safeScaleY < 0.92;
  const padX = isCompact ? 8 : 10;
  const padY = isCompact ? 4 : 6;

  let x = Math.round((minLeft - barRect.left) / safeScaleX - padX);
  let w = Math.round(((maxRight - minLeft) / safeScaleX) + padX * 2);
  let h = Math.round(((maxBottom - minTop) / safeScaleY) + padY * 2);

  const maxW = topBar.offsetWidth || w;
  const maxH = topBar.offsetHeight || h;
  const insetLeft = isCompact ? 6 : 10;
  const insetRight = isCompact ? 8 : 14;
  const insetTop = isCompact ? 2 : 4;
  const insetBottom = isCompact ? 6 : 8;
  const innerW = Math.max(0, maxW - insetLeft - insetRight);
  const innerH = Math.max(0, maxH - insetTop - insetBottom);

  w = Math.max(0, Math.min(w, innerW));
  h = Math.max(0, Math.min(h, innerH));
  x = Math.max(insetLeft, Math.min(x, insetLeft + innerW - w));

  const centerY = ((minTop + maxBottom) / 2 - barRect.top) / safeScaleY;
  let y = Math.round(centerY - h / 2);
  y = Math.max(insetTop, Math.min(y, insetTop + innerH - h));

  topFocusFrame.style.opacity = '1';
  topFocusFrame.style.width = `${w}px`;
  topFocusFrame.style.height = `${h}px`;
  topFocusFrame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function createLabelButton(action, title, svg) {
  const btn = document.createElement('button');
  btn.className = 'label-btn';
  btn.type = 'button';
  btn.title = title;
  btn.dataset.action = action;
  btn.setAttribute('aria-pressed', 'false');
  btn.innerHTML = svg;
  return btn;
}

function createTile(site) {
  const container = document.createElement('div');
  container.className = 'iframe-container';
  container.dataset.siteId = site.id;
  container.style.order = String(selectedSiteIds.indexOf(site.id));
  container.classList.toggle('frozen', frozenSiteIds.has(site.id));
  if (site.id === 'tongyi' || site.id === 'baidu' || site.id === 'bing') {
    container.style.flexBasis = 'min(980px, calc(100vw - 40px))';
  }
  if (site.id === 'metaso') {
    container.style.flexBasis = 'min(920px, calc(100vw - 40px))';
  }

  const labelBar = document.createElement('div');
  labelBar.className = 'label-bar';

  const titleLink = document.createElement('a');
  titleLink.className = 'label-title';
  titleLink.textContent = site.name;
  titleLink.href = site.url;
  titleLink.target = '_blank';
  titleLink.title = 'Open in new tab';

  const actions = document.createElement('div');
  actions.className = 'label-actions';

  const refreshBtn = createLabelButton(
    'refresh',
    'Refresh',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
  );
  refreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    lockGridScroll(260);
    const iframe = container.querySelector('iframe');
    if (!iframe) return;
    iframe.src = 'about:blank';
    requestAnimationFrame(() => {
      iframe.src = site.url;
    });
  });

  const freezeBtn = createLabelButton(
    'freeze',
    'Freeze (skip this send)',
    '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4V44" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.72461 14L41.3656 34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.71923 33.9773L41.2814 14.0228" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10L15 19L6 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 27L15 29L12 38" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 10L33 19L42 21" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 27L33 29L36 38" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 7L24 13L30 7" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 41L24 35L30 41" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );
  freezeBtn.setAttribute('aria-pressed', frozenSiteIds.has(site.id) ? 'true' : 'false');
  freezeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFreeze(site.id);
  });

  const closeBtn = createLabelButton(
    'close',
    'Remove',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>'
  );
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeSite(site.id);
  });

  actions.appendChild(refreshBtn);
  actions.appendChild(freezeBtn);
  actions.appendChild(closeBtn);

  labelBar.appendChild(titleLink);
  labelBar.appendChild(actions);
  
  const iframe = document.createElement('iframe');
  iframe.src = site.url;
  iframe.id = `frame-${site.id}`;
  iframe.allow = "clipboard-read; clipboard-write; microphone";
  
  container.appendChild(labelBar);
  container.appendChild(iframe);
  return container;
}

function renderGrid() {
  grid.innerHTML = ''; // Clear existing
  
  const activeSites = getActiveSites();

  activeSites.forEach(site => {
    grid.appendChild(createTile(site));
  });

  requestAnimationFrame(() => {
    applyOrderStyles(selectedSiteIds);
    setScrollRangeMax();
    const max = Math.max(0, grid.scrollWidth - grid.clientWidth);
    const restored = Math.max(0, Math.min(getStoredGridScrollLeft(), max));
    grid.scrollLeft = restored;
    scrollRange.value = String(restored);
    updateTopFocusFrame();
  });
}

function getSiteIconUrl(site) {
  try {
    const u = new URL(site.url);
    return u.origin;
  } catch (e) {
    return '';
  }
}

function scrollToSite(siteId) {
  const target = grid.querySelector(`.iframe-container[data-site-id="${siteId}"]`);
  if (!target) return;
  const left = target.offsetLeft - 10;
  grid.scrollTo({ left, behavior: 'auto' });
}

function getSiteIconCandidates(site) {
  const origin = getSiteIconUrl(site);
  if (!origin) return [];
  const hostname = (() => {
    try {
      return new URL(site.url).hostname;
    } catch (e) {
      return '';
    }
  })();
  return [
    `${origin}/favicon.ico`,
    `${origin}/favicon.png`,
    `${origin}/favicon.svg`,
    `${origin}/apple-touch-icon.png`,
    `${origin}/apple-touch-icon-precomposed.png`,
    hostname ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64` : '',
    hostname ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(origin)}&sz=64` : '',
    hostname ? `https://icons.duckduckgo.com/ip3/${hostname}.ico` : '',
    hostname ? `https://favicon.yandex.net/favicon/${hostname}` : ''
  ];
}

function createChip(site) {
  const btn = document.createElement('button');
  btn.className = 'site-chip';
  btn.type = 'button';
  btn.title = site.name;
  btn.dataset.siteId = site.id;
  btn.style.order = String(selectedSiteIds.indexOf(site.id));
  btn.draggable = true;
  btn.addEventListener('click', () => scrollToSite(site.id));

  btn.addEventListener('dragstart', (e) => {
    draggingSiteId = site.id;
    draggingOrder = selectedSiteIds.slice();
    btn.classList.add('dragging');
    try {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', site.id);
    } catch (err) { }
  });
  btn.addEventListener('dragend', () => {
    if (draggingOrder && Array.isArray(draggingOrder)) {
      selectedSiteIds = draggingOrder.filter(id => getSiteById(id));
      persistSelectedSites();
      applyOrderStyles(selectedSiteIds);
      populateSettings();
    }
    draggingSiteId = null;
    draggingOrder = null;
    btn.classList.remove('dragging');
  });

  const img = document.createElement('img');
  img.className = 'site-icon';
  img.alt = site.name;
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  const candidates = getSiteIconCandidates(site).filter(Boolean);
  let idx = 0;
  const setNextIcon = () => {
    if (idx >= candidates.length) return false;
    img.src = candidates[idx];
    idx += 1;
    return true;
  };
  if (!setNextIcon()) {
    img.remove();
  }

  const fallback = document.createElement('span');
  fallback.className = 'site-fallback';
  fallback.textContent = site.name.slice(0, 1).toUpperCase();

  img.addEventListener('error', () => {
    const ok = setNextIcon();
    if (!ok) {
      img.remove();
      btn.appendChild(fallback);
    }
  });

  btn.appendChild(img);
  return btn;
}

function renderTopBar() {
  topBarChips.innerHTML = '';
  const activeSites = getActiveSites();
  activeSites.forEach(site => {
    topBarChips.appendChild(createChip(site));
  });
  applyOrderStyles(selectedSiteIds);
  requestAnimationFrame(() => updateTopFocusFrame());
}

function reorderArrayInsert(order, itemId, targetId, placeAfter) {
  const next = order.filter(id => id !== itemId);
  const idx = next.indexOf(targetId);
  if (idx < 0) {
    next.push(itemId);
    return next;
  }
  const insertAt = placeAfter ? idx + 1 : idx;
  next.splice(insertAt, 0, itemId);
  return next;
}

function setupTopBarDnD() {
  topBarChips.addEventListener('dragover', (e) => {
    if (!draggingSiteId) return;
    e.preventDefault();
    const overChip = e.target.closest('.site-chip[data-site-id]');
    if (!overChip) return;
    const overId = overChip.dataset.siteId;
    if (!overId || overId === draggingSiteId) return;

    const rect = overChip.getBoundingClientRect();
    const placeAfter = e.clientX > rect.left + rect.width / 2;
    const base = draggingOrder && Array.isArray(draggingOrder) ? draggingOrder : selectedSiteIds;
    const next = reorderArrayInsert(base, draggingSiteId, overId, placeAfter);
    draggingOrder = next;
    applyOrderStyles(next);
  });

  topBarChips.addEventListener('drop', (e) => {
    if (!draggingSiteId) return;
    e.preventDefault();
    const order = draggingOrder && Array.isArray(draggingOrder) ? draggingOrder : selectedSiteIds;
    selectedSiteIds = order.filter(id => getSiteById(id));
    persistSelectedSites();
    applyOrderStyles(selectedSiteIds);
    populateSettings();
    requestAnimationFrame(() => setScrollRangeMax());
  });
}

function setupScrollControls() {
  setScrollRangeMax();

  scrollRange.addEventListener('input', () => {
    if (scrollLockRaf) stopScrollLock();
    grid.scrollLeft = Number(scrollRange.value || '0');
    updateTopFocusFrame();
    persistGridScrollLeft(grid.scrollLeft);
  });

  let rafId = 0;
  grid.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      scrollRange.value = String(grid.scrollLeft);
      updateTopFocusFrame();
      persistGridScrollLeft(grid.scrollLeft);
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    setScrollRangeMax();
  });
}

function populateSettings() {
  aiCheckboxes.innerHTML = '';
  searchCheckboxes.innerHTML = '';
  SITES.forEach(site => {
    const div = document.createElement('div');
    div.className = 'model-option';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `setting-${site.id}`;
    checkbox.value = site.id;
    checkbox.checked = selectedSiteIds.includes(site.id);
    
    const label = document.createElement('label');
    label.htmlFor = `setting-${site.id}`;
    label.textContent = site.name;
    
    div.appendChild(checkbox);
    div.appendChild(label);

    (isSearchSite(site) ? searchCheckboxes : aiCheckboxes).appendChild(div);
  });
}

function setupSettings() {
  populateSettings();
  
  // Event Listeners
  settingsBtn.addEventListener('click', () => {
    populateSettings();
    settingsModal.classList.add('open');
  });
  
  refreshBtn.addEventListener('click', () => {
    const activeSites = getActiveSites();

    activeSites.forEach(site => {
      const iframe = document.getElementById(`frame-${site.id}`);
      if (iframe) {
        iframe.src = site.url;
      }
    });
  });
  
  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('open');
  });
  
  saveSettingsBtn.addEventListener('click', () => {
    const checked = Array.from(settingsModal.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    if (checked.length === 0) {
      alert('Please select at least one model.');
      return;
    }
    
    const next = normalizeSelectionOrder(checked);
    applySelection(next);
    settingsModal.classList.remove('open');
  });
  
  // Close on outside click
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('open');
    }
  });
}

function buildSearchUrl(site, query) {
  const template = site.queryUrlTemplate || site.url;
  const encoded = encodeURIComponent(query);
  return template.replace('{q}', encoded);
}

let pendingBroadcastTimers = [];

function broadcastPromptToIframes(tabId, prompt, targetSiteIds) {
  pendingBroadcastTimers.forEach((t) => clearTimeout(t));
  pendingBroadcastTimers = [];

  const broadcastId = `b_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const payload = {
    action: 'broadcast_prompt',
    prompt,
    targetSiteIds,
    broadcastId
  };

  const delays = [0, 900, 2200];
  delays.forEach((delay) => {
    const timer = setTimeout(() => {
      chrome.tabs.sendMessage(tabId, payload);
    }, delay);
    pendingBroadcastTimers.push(timer);
  });
}

function sendPrompt() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  
  const activeSites = getActiveSites();
  const frozen = frozenSiteIds;
  const searchSites = activeSites.filter(site => site.type === 'search' && !frozen.has(site.id));
  searchSites.forEach(site => {
    const iframe = document.getElementById(`frame-${site.id}`);
    if (iframe) {
      iframe.src = buildSearchUrl(site, prompt);
    }
  });

  const targetChatSiteIds = activeSites
    .filter(site => site.type !== 'search' && !frozen.has(site.id))
    .map(site => site.id);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    
    // Broadcast to content scripts (they filter by site config themselves, 
    // but effectively only the rendered iframes are active/loaded)
    if (targetChatSiteIds.length > 0) {
      broadcastPromptToIframes(currentTabId, prompt, targetChatSiteIds);
    }
    
    // Clear input after sending
    promptInput.value = '';
  });
}

sendBtn.addEventListener('click', sendPrompt);

promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendPrompt();
  }
});

init();
