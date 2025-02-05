// content.js

// Function to detect ad elements
function detectAdElements() {
    const adSelectors = [
        "div[class*='ad']",
        "iframe[src*='ads']",
        "img[src*='ad']",
        "div[class*='banner']",
        // Add more selectors as needed
    ];

    let adElements = [];
    adSelectors.forEach((selector) => {
        adElements.push(...document.querySelectorAll(selector));
    });

    return adElements;
}

// Function to replace ad elements with custom content
function replaceAdsWithContent() {
    const adElements = detectAdElements();

    adElements.forEach((adElement) => {
        // Create a new widget
        const widget = document.createElement("div");
        widget.className = "adfriend-widget";
        widget.innerHTML = `
      <div class="widget-content">
        <h3>Motivational Quote</h3>
        <p>"The only limit is your imagination."</p>
      </div>
    `;

        // Replace the ad element with the widget
        adElement.replaceWith(widget);
    });
}

// Run the replacement function
replaceAdsWithContent();