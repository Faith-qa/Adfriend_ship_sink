declare const chrome: any; // Remove this if using @types/chrome

const sourceSelect = document.getElementById("source") as HTMLSelectElement;

chrome.storage.sync.get("source", (data: { source: string; }) => {
    if (data.source) {
        sourceSelect.value = data.source;
    }
});

sourceSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ source: sourceSelect.value });
});
