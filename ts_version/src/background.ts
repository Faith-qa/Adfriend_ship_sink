async function updateEasyListRules() {
    try {
        const response = await fetch(chrome.runtime.getURL("easylist-rules-optimized.json"));
        const easyListRules = await response.json();

        // Update Chrome's ad-blocking rules
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: easyListRules.map((rule: { id: any; }) => rule.id),
            addRules: easyListRules
        });

        console.log(`EasyList applied with ${easyListRules.length} rules.`);
    } catch (error) {
        console.error("Failed to load EasyList rules:", error);
    }
}

// Load rules on install and update every 24 hours
chrome.runtime.onInstalled.addListener(updateEasyListRules);
chrome.runtime.onStartup.addListener(updateEasyListRules);
setInterval(updateEasyListRules, 24 * 60 * 60 * 1000);
