document.addEventListener("DOMContentLoaded", () => {
    // Get the select element and type it correctly
    const sourceSelect = document.getElementById("source") as HTMLSelectElement | null;

    // Ensure the element exists before interacting with it
    if (!sourceSelect) {
        console.error('Element with id="source" not found in the DOM.');
        return;
    }

    // Fetch the user's saved source from chrome.storage.sync
    chrome.storage.sync.get("source", (data: { source?: string }) => {
        if (data.source) {
            sourceSelect.value = data.source;
        }
    });

    // Save the selected source to chrome.storage.sync when it changes
    sourceSelect.addEventListener("change", () => {
        chrome.storage.sync.set({ source: sourceSelect.value }, () => {
            console.log(`Source saved: ${sourceSelect.value}`);
        });
    });
});
