import { getQuotes } from "./utils";
;

let quoteContainer: HTMLElement | null = null;
let cachedQuotes: string[] = [];
let cachedSource: string | null = null;
let strictBlockMode: boolean = false; // ✅ Declare strictBlockMode
// Fetch user's ad blocking preference
chrome.storage.sync.get("strictBlock", (data: { strictBlock: boolean; }) => {
    strictBlockMode = data.strictBlock || false;
});

// Function to fetch quotes once and cache them
function fetchQuotes() {
    chrome.runtime.sendMessage({ type: "getSource" }, (response: { source: string }) => {
        if (!response || !response.source) {
            console.error("Failed to fetch source from runtime message:", response);
            return;
        }

        console.log("Source received from runtime:", response.source);

        if (response.source !== cachedSource) {
            cachedSource = response.source;
            cachedQuotes = getQuotes(response.source);

            console.log("Cached quotes:", cachedQuotes);

            // If cachedQuotes is empty, log the issue
            if (cachedQuotes.length === 0) {
                console.warn(`No quotes found for source: ${response.source}`);
            }
        }
    });
}

// Function to update the quote every 5 seconds
function updateQuote() {
    if (!quoteContainer || cachedQuotes.length === 0) return;

    quoteContainer.textContent = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
}

// Function to detect ad containers (after EasyList blocks network requests)
function detectAdContainers(): NodeListOf<Element> {
    return document.querySelectorAll(`
        div[class*="ad"],
        div[id*="ad"],
        section[class*="ad"],
        iframe
    `);
}

// Function to replace only the first ad container with a quote
function replaceFirstAd() {
    const ads = detectAdContainers();

    // If no ads are detected, create the container at the top
    if (!quoteContainer) {
        quoteContainer = document.createElement("div");
        quoteContainer.className = "spiritual-quote";
        quoteContainer.textContent = cachedQuotes.length
            ? cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)]
            : "With great power comes great responsibility."; // Fallback text

        // Insert at the very top of the page
        document.body.prepend(quoteContainer);

        injectStyles();
    }

    // Remove all other detected ads
    ads.forEach((ad) => ad.remove());
}

// Function to remove all leftover empty ad spaces
function removeEmptyAdContainers() {
    detectAdContainers().forEach((ad) => {
        if (!ad.hasChildNodes()) {
            ad.remove(); // Remove if the ad container is empty
        }
    });
}

// Function to inject styles (prevent multiple injections)
function injectStyles() {
    if (document.getElementById("spiritual-quotes-style")) return;

    const style = document.createElement("style");
    style.id = "spiritual-quotes-style";
    style.innerHTML = `
        .spiritual-quote {
            position: sticky; /* Keeps it visible at the top */
            top: 0;
            z-index: 1000; /* Ensure it stays above other elements */
            padding: 20px;
            background-color: var(--quote-bg, #F7F2E0);
            border: 2px solid var(--quote-border, #E0C097);
            font-size: 18px;
            font-weight: bold;
            font-style: italic;
            color: var(--quote-color, #5D4037);
            text-align: center;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px; /* Adds space below the quote */
            opacity: 1;
            animation: fadeIn 1s forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Run functions after EasyList blocks network requests
fetchQuotes();
replaceFirstAd();
removeEmptyAdContainers();
setInterval(updateQuote, 5000);

// Observe dynamically loaded ad containers
const observer = new MutationObserver(() => {
    replaceFirstAd();
    removeEmptyAdContainers();
});
observer.observe(document.body, { childList: true, subtree: true });
