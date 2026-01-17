
# Function Log

This document records all functions used in the project, their parameters, and return values.

## Core Functions

## popup.js
(Deprecated in favor of Dashboard)
- `init()`: Initializes the popup UI by generating the list of checkboxes based on the configuration.
- `(event listener) sendBtn.click`: Handles the send button click, gathers selected sites, and sends a message to the background script.

## background.js
- `(event listener) chrome.action.onClicked`: Opens `dashboard.html` in a new tab.
- `(event listener) chrome.runtime.onMessage`: Receives popup messages (`distribute_prompt`) for compatibility.
- `handleDistributePrompt(prompt, siteIds)`: Legacy entry point for popup-driven tab mode (currently stubbed).
  - **Params**: `prompt` (String), `siteIds` (Array<String>).

## content.js
- `getElementBySelectors(selectors)`: Robustly finds an element using a list of selectors, trying standard querySelector first then deep Shadow DOM traversal.
  - **Params**: `selectors` (String|String[]).
  - **Returns**: `HTMLElement|null`.
- `getElementsBySelectors(selectors)`: Returns all matching elements for selectors, including Shadow DOM matches.
  - **Params**: `selectors` (String|String[]).
  - **Returns**: `HTMLElement[]`.
- `deepQuerySelector(selector, root)`: Traverses Shadow DOMs recursively to find an element matching the selector.
  - **Params**: `selector` (String), `root` (Node, default document).
  - **Returns**: `HTMLElement|null`.
- `deepQuerySelectorAll(selector, root)`: Traverses Shadow DOMs recursively and returns all matching elements.
  - **Params**: `selector` (String), `root` (Node, default document).
  - **Returns**: `HTMLElement[]`.
- `dispatchBeforeInput(element, data)`: Dispatches a `beforeinput` event to improve editor compatibility.
  - **Params**: `element` (HTMLElement), `data` (String).
- `simulateRealClick(el)`: Dispatches pointer/mouse events to simulate a more realistic click.
  - **Params**: `el` (HTMLElement).
- `pickBestButtonCandidate(candidates)`: Chooses the most likely clickable send button.
  - **Params**: `candidates` (HTMLElement[]).
  - **Returns**: `HTMLElement|null`.
- `findBestButton(selectors)`: Finds the best visible send button from selectors (including Shadow DOM).
  - **Params**: `selectors` (String|String[]).
  - **Returns**: `HTMLElement|null`.
- `isProbablyVisible(el)`: Determines whether an element is visible and has a non-trivial bounding box.
  - **Params**: `el` (HTMLElement).
  - **Returns**: `boolean`.
- `pickBestInputCandidate(candidates)`: Chooses the most likely input element (usually near the bottom).
  - **Params**: `candidates` (HTMLElement[]).
  - **Returns**: `HTMLElement|null`.
- `findKimiInput()`: Finds the most likely Kimi input element from multiple candidates.
  - **Returns**: `HTMLElement|null`.
- `findKimiTextareaNear(el)`: Attempts to find a nearby textarea for Kimi (form/ancestors first).
  - **Params**: `el` (HTMLElement).
  - **Returns**: `HTMLTextAreaElement|null`.
- `getInputText(el)`: Reads text from textarea/input/contenteditable for validation.
  - **Params**: `el` (HTMLElement).
  - **Returns**: `string`.
- `isLexicalEditor(el)`: Detects Lexical-based contenteditable editors (Kimi chat-input-editor).
  - **Params**: `el` (HTMLElement).
  - **Returns**: `boolean`.
- `clearContentEditable(el)`: Clears contenteditable content via selection + delete command.
  - **Params**: `el` (HTMLElement).
- `clearInputElement(el)`: Clears textarea/input/contenteditable value and dispatches input/change.
  - **Params**: `el` (HTMLElement).
- `dispatchBeforeInputWithType(element, data, inputType)`: Dispatches a `beforeinput` event with a custom `inputType`.
  - **Params**: `element` (HTMLElement), `data` (String), `inputType` (String).
- `tryInsertTextContentEditable(el, text)`: Tries `execCommand('insertText')` on a contenteditable with selection handling.
  - **Params**: `el` (HTMLElement), `text` (String).
  - **Returns**: `Promise<boolean>`.
- `tryPasteText(el, text)`: Attempts to input text by dispatching a paste event (Lexical-friendly).
  - **Params**: `el` (HTMLElement), `text` (String).
  - **Returns**: `Promise<boolean>`.
- `escapeHtml(text)`: Escapes text for safe HTML injection.
  - **Params**: `text` (String).
  - **Returns**: `string`.
- `forceSetContentEditable(el, text)`: Forces contenteditable DOM to contain text and dispatches input events.
  - **Params**: `el` (HTMLElement), `text` (String).
  - **Returns**: `Promise<boolean>`.
- `ensureKimiBridgeInstalled()`: Injects an in-page Kimi bridge (runs in page context) for fill/send fallback.
- `kimiBridgeFillAndSend(prompt, doSend)`: Uses the in-page bridge to fill and optionally send in Kimi.
  - **Params**: `prompt` (String), `doSend` (boolean).
  - **Returns**: `Promise<{ ok: boolean, sent: boolean }>` 
- `isInputTextLikelyOk(inputEl, text)`: Heuristic validation that prompt text landed in the input.
  - **Params**: `inputEl` (HTMLElement), `text` (String).
  - **Returns**: `boolean`.
- `waitForElement(selectors, timeout)`: Waits for an element matching any of the selectors to appear. Uses polling and checks extension context validity.
  - **Params**: `selectors` (String|String[]), `timeout` (number, default 10000ms).
  - **Returns**: `Promise<Element>`.
- `simulateTyping(element, text)`: Simulates human-like typing by dispatching keydown, keypress, input, and keyup events with random delays. Supports Shadow DOM via `composed: true`.
  - **Updates**: Added `compositionstart`, `compositionupdate`, `compositionend` events and `element.click()` to improve editor compatibility.
  - **Params**: `element` (HTMLElement), `text` (String).
- `setNativeValue(element, value)`: Sets the value of an input/textarea/contenteditable element, handling React/Vue state tracking and site quirks. For Claude and Kimi (Lexical), tries `execCommand('insertText', value)` with validation before falling back.
  - **Params**: `element` (HTMLElement), `value` (String).
- `simulateEnterKey(element)`: Dispatches Enter key events to trigger sending.
  - **Params**: `element` (HTMLElement).
- `simulateCtrlEnterKey(element)`: Dispatches Ctrl+Enter key events to trigger sending for editors that require it.
  - **Params**: `element` (HTMLElement).
- `handleFillAndSend(prompt, config)`: Main orchestration function to find input, fill it, and click send/press enter.
- `getCurrentSiteConfig()`: Returns the current site config via hostname matching (Kimi uses `kimi.com`).
- `(message handler) collect_outputs`: Extracts current conversation output and sends chunked results.
  - **Params**: `requestId` (String), `targetSiteIds` (Array<String>).
- `(message handler) gemini_upload_request`: Prepares receiving markdown chunks for Gemini file upload.
  - **Params**: `requestId` (String), `filename` (String), `total` (number), `prompt` (String).
- `(message handler) gemini_upload_chunk`: Receives markdown chunk; uploads file and triggers summary when complete.
  - **Params**: `requestId` (String), `index` (number), `total` (number), `chunk` (String).
- `findGeminiFileInput()`: Attempts to find Gemini file input by selectors and attach button click.
  - **Returns**: `Promise<HTMLInputElement|null>`.

## dashboard.js
- `init()`: Initializes the dashboard by rendering the grid and setting up settings.
- `renderGrid()`: Dynamically creates iframes for selected sites in a grid layout (columns = number of selected sites).
- `getSiteIconUrl(site)`: Returns a favicon URL derived from the site's origin.
- `renderTopBar()`: Renders circular site icons for active sites.
- `scrollToSite(siteId)`: Scrolls the horizontal canvas to a site's container.
- `setScrollRangeMax()`: Updates the horizontal scroll slider max based on content width.
- `setupScrollControls()`: Wires the horizontal slider to the grid's `scrollLeft` and keeps them in sync.
- `setupSettings()`: Initializes the settings modal logic (populate checkboxes, save/load from localStorage).
- `buildSearchUrl(site, query)`: Builds a search URL from a `{q}` template.
  - **Params**: `site` (Object), `query` (String).
  - **Returns**: `string`.
- `broadcastPromptToIframes(tabId, prompt, targetSiteIds)`: Sends `broadcast_prompt` to iframe content scripts with retries.
  - **Params**: `tabId` (number), `prompt` (String), `targetSiteIds` (Array<String>).
- `setupCollectOutputs()`: Registers the collection message listener and assembles chunked results.
- `setupSaveOutputs()`: Wires the “保存输出” button to collect model outputs and download a Markdown file.
- `setupSummary()`: Wires the “总结” button to collect outputs, open Gemini, and auto-send prompt.
- `openGeminiForSummary(markdown)`: Opens Gemini tab and sends summarization prompt with collected markdown.
  - **Params**: `markdown` (String).
- `sendPrompt()`: Broadcasts the prompt from the input to all active iframes.
- `(event listener) sendBtn.click`: Triggers `sendPrompt`.
- `(event listener) promptInput.keydown`: Triggers `sendPrompt` on Enter key.

## extractors.js
- `AI_SYNCER_EXTRACTORS.extractConversationText(siteId)`: Extracts conversation text for current page.
  - **Params**: `siteId` (String).
  - **Returns**: `string`.
- `AI_SYNCER_EXTRACTORS.splitToChunks(text, chunkSize)`: Splits text into chunks for messaging.
  - **Params**: `text` (String), `chunkSize` (number).
  - **Returns**: `string[]`.

## net_rules.json (DNR)
- Rule 1: Removes `X-Frame-Options` and `Content-Security-Policy` headers for target domains to allow iframing.
  - **Updates**: Added `account.aliyun.com`, `passport.aliyun.com`, `login.aliyun.com`, `dashscope.aliyun.com` to allow Tongyi Qianwen login flow.
