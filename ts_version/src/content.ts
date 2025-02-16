// content.ts

// 1. Define the interface for clarity
import { getQuotes } from "./utils";

interface Quote {
    text: string;
    author?: string;
    type: string;
}

let widgetContainer: HTMLElement | null = null;
let cachedQuotes: Quote[] = [];
let cachedSource: string | null = null;

let strictBlockMode = false;
let refreshIntervalId: number | null = null;

// 2. Functions to read from Chrome storage / runtime
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

// 3. Fetch quotes if needed
async function fetchQuotes(): Promise<void> {
    const source = await getSource();
    if (!source) return;

    if (source !== cachedSource) {
        cachedSource = source;
        try {
            const quotesRaw = await getQuotes(source);
            cachedQuotes = quotesRaw.map((q) => ({
                text: q,
                author: "",
                type: source,
            }));

            if (cachedQuotes.length === 0) {
                console.warn(`No quotes found for source: ${source}`);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }
}

// 4. Ad container logic
function detectAdContainers(): NodeListOf<Element> {
    return document.querySelectorAll(`
    div[class*="ad"],
    div[id*="ad"],
    section[class*="ad"],
    iframe,
    ins,
    [data-ad],
    [data-testid*="ad"]
  `);
}

function removeEmptyAdContainers(): void {
    detectAdContainers().forEach((ad) => {
        if (!ad.hasChildNodes()) {
            ad.remove();
        }
    });
}

// 5. Widget creation
function createWidget(): void {
    if (widgetContainer) return;

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
    makeDraggable(widgetContainer);

    document.getElementById("close-btn")?.addEventListener("click", () => {
        removeWidget();
    });

    if (!refreshIntervalId) {
        refreshIntervalId = window.setInterval(() => {
            refreshContent();
        }, 10000);
    }
}

function removeWidget(): void {
    if (widgetContainer) {
        widgetContainer.remove();
        widgetContainer = null;
    }
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
    }
}

function refreshContent(): void {
    if (!widgetContainer || cachedQuotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
    const currentQuote = cachedQuotes[randomIndex];

    const quoteElement = document.getElementById("quote");
    const authorElement = document.getElementById("author");
    const contentTypeElement = document.getElementById("content-type");

    if (quoteElement) quoteElement.textContent = currentQuote.text;
    if (authorElement) authorElement.textContent = currentQuote.author || "";
    if (contentTypeElement) {
        contentTypeElement.textContent = currentQuote.type;
        contentTypeElement.style.display = "none";
    }
}

// 6. Styles
function injectStyles(): void {
    if (document.getElementById("widget-style")) return;

    const style = document.createElement("style");
    style.id = "widget-style";
    style.innerHTML = `
    .widget-container {
      position: fixed;
      top: 10px;
      right: 20px;
      width: 300px;
      min-width: 300px;
      max-width: 600px;
      z-index: 10000;
      cursor: grab;
    }
    .widget-container:active {
      cursor: grabbing;
    }
    .widget-card {
      background: linear-gradient(45deg, #ff4d79, #4da6ff);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      transition: background 0.3s ease-in-out, opacity 0.3s;
      font-size: 12px;
      font-weight: 500;
      color: white;
      gap: 10px;
      user-select: none;
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
      margin: 10;
    }
    #close-btn:hover {
      color: red;
    }
  `;
    document.head.appendChild(style);
}

// 7. Make the widget draggable
function makeDraggable(element: HTMLElement): void {
    let isDragging = false;
    let startX = 0, startY = 0, initialX = 0, initialY = 0;

    element.addEventListener("mousedown", (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        const rect = element.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        element.style.left = `${initialX + dx}px`;
        element.style.top = `${initialY + dy}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
}

function resetGlobalStyles(): void {
    document.body.style.opacity = "1";
    document.body.style.backgroundColor = "";
    document.body.style.filter = "";
}

// 8. Initialization
(async function init() {
    strictBlockMode = await getStrictBlockMode();
    await fetchQuotes();
    resetGlobalStyles();
    createWidget();
    refreshContent();
})();

// 9. Mutation Observer
const observer = new MutationObserver(() => {
    createWidget();
    removeEmptyAdContainers();
});
observer.observe(document.body, { childList: true, subtree: true });
