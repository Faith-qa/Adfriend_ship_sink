import { getQuotes } from "./utils";

let widgetContainer: HTMLElement | null = null;
let cachedQuotes: { text: string; author?: string; type: string }[] = [];
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

    if (source !== cachedSource) {
        cachedSource = source;
        try {
            cachedQuotes = (await getQuotes(source)).map(q => ({ text: q, author: "", type: source }));
            if (cachedQuotes.length === 0) {
                console.warn(`No quotes found for source: ${source}`);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }
}

// Function to detect ad containers and remove empty ones
function detectAdContainers(): NodeListOf<Element> {
    return document.querySelectorAll(`
        div[class*="ad"], div[id*="ad"],
        section[class*="ad"], iframe,
        ins, [data-ad], [data-testid*="ad"]
    `);
}

function removeEmptyAdContainers() {
    detectAdContainers().forEach((ad) => {
        if (!ad.hasChildNodes()) {
            ad.remove();
        }
    });
}

// Function to create and display the widget
function createWidget() {
    if (widgetContainer) return; // Prevent duplicate widgets

    widgetContainer = document.createElement("div");
    widgetContainer.className = "widget-container";
    widgetContainer.innerHTML = `
        <div class="widget-card" id="quote-widget">
            <button id="close-btn">&times;</button>
            <div class="content-type" id="content-type"></div>
            <div class="quote" id="quote">"Loading quote..."</div>
            <div class="author" id="author"></div>
        </div>
    `;

    document.body.appendChild(widgetContainer);
    injectStyles();

    document.getElementById("close-btn")?.addEventListener("click", () => {
        widgetContainer?.remove();
        widgetContainer = null;
    });

    setInterval(refreshContent, 5000);
}

// Function to update the quote in the widget
function refreshContent() {
    if (!widgetContainer || cachedQuotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
    const currentQuote = cachedQuotes[randomIndex];

    const quoteElement = document.getElementById("quote") as HTMLDivElement;
    const authorElement = document.getElementById("author") as HTMLDivElement;
    const contentTypeElement = document.getElementById("content-type") as HTMLDivElement;

    quoteElement.textContent = currentQuote.text;
    authorElement.textContent = currentQuote.author || '';
    contentTypeElement.textContent = currentQuote.type;

    // Hide the source text (e.g., "bible", "quran", etc.)
    if (contentTypeElement) {
        contentTypeElement.style.display = "none";
    }
}

// Function to inject widget styling
function injectStyles() {
    if (document.getElementById("widget-style")) return;

    const style = document.createElement("style");
    style.id = "widget-style";
    style.innerHTML = `
        .widget-container {
            position: fixed;
            top: 10px;
            right: 20px;
            width: 300px;
            min-width: 300px; /* Set minimum width */
            max-width: 600px; /* Prevent it from stretching too much */
            z-index: 10000;
        }

        .widget-card {
            background: linear-gradient(135deg, #e0f7fa, #b2dfdb);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            transition: all 0.3s ease-in-out;
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }

        .widget-card:hover {
            transform: scale(1.02);
        }

        #close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: black;
        }

        #close-btn:hover {
            color: red;
        }
    `;
    document.head.appendChild(style);
}

// Ensure only the widget styling is applied
function resetGlobalStyles() {
    document.body.style.opacity = "1"; // Ensure visibility
    document.body.style.backgroundColor = ""; // Remove forced white background
    document.body.style.filter = ""; // Remove any blur effect
}

// Run functions
(async function init() {
    strictBlockMode = await getStrictBlockMode();
    await fetchQuotes();
    resetGlobalStyles(); // Reset any global styling that may have affected the page
    createWidget();
    setInterval(refreshContent, 30000);
})();

const observer = new MutationObserver(() => {
    createWidget();
    removeEmptyAdContainers();
});
observer.observe(document.body, { childList: true, subtree: true });
