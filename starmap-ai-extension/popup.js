import { SITES } from './sites.js';

const modelListEl = document.getElementById('modelList');
const sendBtn = document.getElementById('sendBtn');
const promptInput = document.getElementById('promptInput');
const statusEl = document.getElementById('status');

// Initialize UI
function init() {
  SITES.forEach(site => {
    const div = document.createElement('div');
    div.className = 'model-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `check-${site.id}`;
    checkbox.value = site.id;
    checkbox.checked = true; // Default checked
    
    const label = document.createElement('label');
    label.htmlFor = `check-${site.id}`;
    label.textContent = site.name;
    
    div.appendChild(checkbox);
    div.appendChild(label);
    modelListEl.appendChild(div);
  });
}

// Handle Send
sendBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    statusEl.textContent = 'Please enter a prompt.';
    return;
  }

  const selectedSiteIds = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (selectedSiteIds.length === 0) {
    statusEl.textContent = 'Please select at least one model.';
    return;
  }

  statusEl.textContent = 'Sending...';
  
  // Send message to background script
  try {
    await chrome.runtime.sendMessage({
      action: 'distribute_prompt',
      prompt: prompt,
      sites: selectedSiteIds
    });
    statusEl.textContent = 'Sent!';
    setTimeout(() => { statusEl.textContent = ''; }, 2000);
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error sending prompt.';
  }
});

init();
