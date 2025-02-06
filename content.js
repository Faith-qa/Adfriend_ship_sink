const scriptUrl = chrome.runtime.getURL("AdDetection/AdBlock.js");
console.log("Attempting to load AdBlock.js from:", scriptUrl);

const script = document.createElement("script");
script.src = scriptUrl;

script.onload = () => {
    console.log("AdBlock.js script loaded. Waiting for AdBlock class...");

    let attempts = 0;
    const maxAttempts = 50; // Maximum number of attempts to check for AdBlock
    const checkInterval = setInterval(() => {
        if (typeof window.AdBlock !== "undefined") {
            console.log("AdBlock is available, initializing...");
            new window.AdBlock();
            clearInterval(checkInterval);
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                console.error("AdBlock not defined after maximum attempts. Aborting.");
                clearInterval(checkInterval);
            } else {
                console.warn("Waiting for AdBlock to be defined...");
            }
        }
    }, 100); // Check every 100ms
};

script.onerror = () => {
    console.error("Failed to load AdBlock.js. Check file path and manifest.");
};

// Inject the script into the webpage
document.documentElement.appendChild(script);