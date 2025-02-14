import { getQuotes } from "./utils";

let quoteContainer: HTMLElement | null = null;
let cachedQuotes: string[] = [];
let cachedSource: string | null = null;
let strictBlockMode: boolean = false;

async function getStrictBlockMode(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("strictBlock", (data: { strictBlock?: boolean }) => {
            resolve(data.strictBlock || false);
        });
    });
}

async function getSource(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "getSource" }, (response: { source?: string }) => {
            if (!response || !response.source) {
                console.error("Failed to fetch source from runtime message:", response);
                resolve(null);
            } else {
                resolve(response.source);
            }
        });
    });
}

async function fetchQuotes() {
    const source = await getSource();
    if (!source) return;

    console.log("Source received from runtime:", source);

    if (source !== cachedSource) {
        cachedSource = source;
        try {
            cachedQuotes = await getQuotes(source);
            console.log("Cached quotes:", cachedQuotes);

            if (cachedQuotes.length === 0) {
                console.warn(`No quotes found for source: ${source}`);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }
}

function updateQuote() {
    if (!quoteContainer) {
        console.warn("Quote container not found. Replacing first ad.");
        replaceFirstAd();
    }
    if (cachedQuotes.length === 0) return;

    quoteContainer!.textContent = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
}

function detectAdContainers(): NodeListOf<Element> {
    return document.querySelectorAll(`
        div[class*="ad"], div[id*="ad"],
        section[class*="ad"], iframe,
        ins, [data-ad], [data-testid*="ad"]
    `);
}

function replaceFirstAd() {
    const ads = detectAdContainers();

    if (!quoteContainer) {
        quoteContainer = document.createElement("div");
        quoteContainer.className = "spiritual-quote";
        quoteContainer.textContent = cachedQuotes.length
            ? cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)]
            : "With great power comes great responsibility.";

        document.body.prepend(quoteContainer);
        injectStyles();
    }

    ads.forEach((ad) => ad.remove());
}

function removeEmptyAdContainers() {
    detectAdContainers().forEach((ad) => {
        if (!ad.hasChildNodes()) {
            ad.remove();
        }
    });
}

function injectStyles() {
    if (document.getElementById("spiritual-quotes-style")) return;

    const style = document.createElement("style");
    style.id = "spiritual-quotes-style";
    style.innerHTML = `
        .spiritual-quote {
            position: sticky;
            top: 0;
            z-index: 1000;
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
            margin-bottom: 20px;
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

(async function init() {
    strictBlockMode = await getStrictBlockMode();
    await fetchQuotes();
    replaceFirstAd();
    removeEmptyAdContainers();
    setInterval(updateQuote, 5000);
})();

const observer = new MutationObserver(() => {
    replaceFirstAd();
    removeEmptyAdContainers();
});
observer.observe(document.body, { childList: true, subtree: true });
