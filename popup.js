const fillBtn = document.getElementById('fillBtn');
const autoFillToggle = document.getElementById('autoFillToggle');

// Load initial state
chrome.storage.sync.get(['autoFill'], (result) => {
    autoFillToggle.checked = !!result.autoFill;
});

// Save state on change
autoFillToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ autoFill: autoFillToggle.checked });
});

fillBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "fillForm" }, (response) => {
            if (chrome.runtime.lastError) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }, () => {
                    chrome.tabs.sendMessage(tab.id, { action: "fillForm" });
                });
            }
        });

        const originalText = fillBtn.innerHTML;
        fillBtn.innerHTML = 'Done! ✨';
        fillBtn.style.background = '#22c55e';

        setTimeout(() => {
            fillBtn.innerHTML = originalText;
            fillBtn.style.background = '';
        }, 2000);
    }
});
