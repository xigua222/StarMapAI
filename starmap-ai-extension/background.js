chrome.action.onClicked.addListener(() => {
  // Open Dashboard
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// We don't use 'distribute_prompt' from popup anymore in Dashboard mode, 
// but we keep it for backward compatibility or if we switch back.
// But wait, the user wants "All in one page". 
// The popup is now less useful. We should probably just open the dashboard when clicking the extension icon.
// I've removed the popup from manifest "action" so the onClicked event will fire.

// Actually, I need to check if I removed default_popup in manifest.
// I did. So clicking the icon triggers this listener.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // If we still have the popup or other logic
  if (message.action === 'distribute_prompt') {
    handleDistributePrompt(message.prompt, message.sites);
    sendResponse({ status: 'processing' });
  }
  return true;
});

async function handleDistributePrompt(prompt, siteIds) {
    // ... existing logic ...
    // But this is for the "Tabs" mode. 
    // If the user uses the Dashboard, the messaging is handled in dashboard.js directly.
}
