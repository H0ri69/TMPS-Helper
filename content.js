/**
 * Core logic to fill forms
 */
function fillMaintenanceForm() {
    console.log("Form Automator: Starting to fill form...");

    // Fill text inputs and textareas with "ok"
    const textFields = document.querySelectorAll('input[type="text"], input:not([type]), textarea');
    textFields.forEach(field => {
        field.value = "ok";
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Check all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    console.log(`Form Automator: Filled ${textFields.length} text fields and checked ${checkboxes.length} checkboxes.`);
}

// Auto-run if enabled in storage
chrome.storage.sync.get(['autoFill'], (result) => {
    if (result.autoFill) {
        // Wait a bit for the page to fully load dynamic content if necessary
        if (document.readyState === 'complete') {
            fillMaintenanceForm();
        } else {
            window.addEventListener('load', fillMaintenanceForm);
        }
    }
});

// Listen for the backtick (`) shortcut
window.addEventListener('keydown', (event) => {
    if (event.key === '`') {
        event.preventDefault();
        fillMaintenanceForm();
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
        fillMaintenanceForm();
        sendResponse({ status: "success" });
    }
});
