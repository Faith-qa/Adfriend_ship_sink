// popup.js
document.getElementById("save").addEventListener("click", () => {
    const contentType = document.querySelector('input[name="contentType"]:checked').value;
    chrome.storage.sync.set({ contentType }, () => {
        console.log("Settings saved!");
    });
});