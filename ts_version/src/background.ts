// Function to update EasyList rules
async function updateEasyListRules() {
    try {
        const response = await fetch(chrome.runtime.getURL("easylist-rules-optimized.json"));
        const easyListRules = await response.json();

        // Update Chrome's ad-blocking rules
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: easyListRules.map((rule: { id: any }) => rule.id),
            addRules: easyListRules
        });

        console.log(`EasyList applied with ${easyListRules.length} rules.`);
    } catch (error) {
        console.error("Failed to load EasyList rules:", error);
    }
}

// Load rules on install and update every 24 hours
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    updateEasyListRules();

    // Initialize default source in storage
    chrome.storage.sync.get("source", (data: { source?: string }) => {
        if (!data.source) {
            chrome.storage.sync.set({ source: "bible" }, () => {
                console.log("Default source set to 'bible'.");
            });
        }
    });
});

chrome.runtime.onStartup.addListener(updateEasyListRules);
setInterval(updateEasyListRules, 24 * 60 * 60 * 1000);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);

    if (message.type === "getSource") {
        chrome.storage.sync.get("source", (data: { source?: string }) => {
            console.log("Source retrieved from storage:", data.source);
            sendResponse({ source: data.source || "bible" }); // Fallback to "bible"
        });

        // Return true to indicate async response
        return true;
    }
});

// 🚀 NEW: Open landing page when clicking the extension icon
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("AdFriend-Landing_page/index.html") });
});
