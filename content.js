const cssUrl = chrome.runtime.getURL("widget-card/widget_styles.css");
console.log(cssUrl); // This should print the correct URL

// Function to detect ad elements
function detectAdElements() {
    const adSelectors = [
        // General ad-related selectors
        "div[class*='ad']",
        "iframe[src*='ads']",
        "img[src*='ad']",
        "div[class*='banner']",
        "div[id*='ad']",
        "div[class*='sponsored']",
        "ins.adsbygoogle",
        "section[class*='ad']",
        "aside[class*='ad']",
        "iframe",
    ];

    let adElements = [];
    adSelectors.forEach((selector) => {
        adElements.push(...document.querySelectorAll(selector));
    });

    // Additional refinement: filter detected elements
    adElements = adElements.filter((element) => {
        // Check for keywords within the element's text content
        const adKeywords = ["ad", "sponsored", "click here", "promotion"];
        const textContent = element.textContent.toLowerCase();

        return adKeywords.some((keyword) => textContent.includes(keyword));
    });

    return adElements;
}

// Function to dynamically create and inject a popup widget
async function injectPopupWidget(targetAd) {
    try {
        const response = await fetch(chrome.runtime.getURL("widget-card/widget.html"));
        const widgetHTML = await response.text();

        // Create a container for the widget
        const popupContainer = document.createElement("div");
        popupContainer.innerHTML = widgetHTML;

        // Apply styles manually
         popupContainer.style.cssText = `
            top: ${targetAd.offsetTop}px;
            left: ${targetAd.offsetLeft}px;
            width: ${targetAd.offsetWidth || 300}px;
            height: ${targetAd.offsetHeight || 150}px;`;
            //position: absolute;
        //   background: white;
        //     border-radius: 10px;
        //     padding: 20px;
        //     box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        //     z-index: 10000;
        // `;

        // Inject widget_styles.css manually
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = chrome.runtime.getURL("widget-card/widget_styles.css");
        document.head.appendChild(styleLink);

        // Append the widget to the body
        document.body.appendChild(popupContainer);

        // Inject widget.js manually
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("widget-card/widget.js");
        document.body.appendChild(script);

        // Close button functionality
        const closeButton = popupContainer.querySelector("#close-btn");
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                popupContainer.remove();
            });
        }
    } catch (error) {
        console.error("Error loading widget:", error);
    }
}

// Function to replace ads with widgets
function replaceAdsWithPopup() {
    const adElements = detectAdElements();

    adElements.forEach((adElement) => {
        // Check if the ad is already replaced
        if (adElement.dataset.replaced) return;

        // Mark this ad as replaced
        adElement.dataset.replaced = "true";

        // Inject the widget for this ad
        injectPopupWidget(adElement);

        // Remove the original ad element
        adElement.remove();
    });
}

// Set up a throttled observer callback
let observerTimeout;
function throttledReplaceAds() {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
        replaceAdsWithPopup();
    }, 200); // Adjust throttle time as needed
}

// Run the replacement function immediately for existing ads
replaceAdsWithPopup();

// Set up a Mutation Observer for dynamically added ads
document.addEventListener("DOMContentLoaded", () => {
    // Ensure body is available
    if (!document.body) {
        console.error("Body is not available, cannot observe DOM changes.");
        return;
    }

    // Set up a Mutation Observer for dynamically added ads
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;

        // Check if any mutation involves addition of new nodes
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
            }
        });

        // Run the replacement function if needed
        if (shouldRun) {
            throttledReplaceAds();
        }
    });

    // Now safely observe changes in the body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});