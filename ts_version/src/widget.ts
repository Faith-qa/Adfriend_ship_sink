import {getQuotes} from "./utils";

console.log("🚀 widget.js is loaded and running!");

document.addEventListener("DOMContentLoaded", async function () {
    let quotes: any[] = [];

    // Request quotes immediately when the widget loads
    chrome.runtime.sendMessage({ type: "getSource" }, async (response: { source?: string }) => {
        if (!response || !response.source) {
            console.error("Failed to fetch source from runtime message:", response);
            return;
        }

        console.log("Source received in widget:", response.source);
        quotes = (await getQuotes(response.source)).map(q => ({ text: q, author: "", type: response.source }));
        refreshContent();
    });

    let currentIndex = 0;
    const quoteElement = document.getElementById("quote") as HTMLDivElement;
    const authorElement = document.getElementById("author") as HTMLDivElement;
    const contentTypeElement = document.getElementById("content-type") as HTMLDivElement;
    const iconElement = document.getElementById("icon") as HTMLImageElement;
    const closeButton = document.getElementById("close-btn") as HTMLButtonElement;
    const widgetContainer = document.getElementById("quote-widget") as HTMLDivElement;

    function refreshContent() {
        if (quotes.length === 0) {
            console.warn("No quotes available yet.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const currentQuote = quotes[randomIndex];

        quoteElement.textContent = currentQuote.text;
        authorElement.textContent = currentQuote.author || '';
        contentTypeElement.textContent = currentQuote.type;

        const iconPaths: Record<string, string> = {
            "bible": "icons/icon48.png",
            "quran": "icons/icon48.png",
            "buddhist": "icons/icon48.png",
            "motivational": "icons/icon16.png",
            "reminder": "icons/icon128.png",
            "healthy": "icons/icon15.png"
        };

        if (iconPaths[currentQuote.type]) {
            iconElement.src = iconPaths[currentQuote.type];
            iconElement.style.display = "block";
        } else {
            iconElement.style.display = "none";
        }
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            widgetContainer.style.display = "none";
            console.log("Popup closed.");
        });
    } else {
        console.error("Close button not found in the document.");
    }

    setInterval(refreshContent, 5000);
});
