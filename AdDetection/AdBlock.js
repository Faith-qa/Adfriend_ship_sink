class AdBlock {
    constructor() {
        console.log("AdBlock initialized");

        this.overrideWindowOpen();
    }

    // Corrected method name
    overrideWindowOpen() {
        const originalWindowOpen = window.open;
        window.open = (...args) => {
            const newPopup = originalWindowOpen.apply(this, args);
            if (newPopup) {
                newPopup.onload = () => this.detectAndReplaceAd(newPopup.document);
            }
            return newPopup;
        };
    }

    // Fixed typo: `add` → `ads`
    async detectAndReplaceAd(doc) {
        setTimeout(async () => {
            const ads = this.detectAdElements(doc);
            for (let ad of ads) { // Fix typo here
                if (await this.isAd(ad)) {
                    ad.replaceWith(this.createReplacementWidget());
                    console.log("✅ Ad replaced:", ad);
                }
            }
        }, 2000);
    }

    //  Fixed method formatting
    detectAdElements(doc) {
        const adSelectors = [
            "iframe[src*='ads']",
            "img[src*='ad']",
            "div[id*='ad']",
            "video[src*='ad']",
            "a[href*='clickbait']"
        ];
        return doc.querySelectorAll(adSelectors.join(","));
    }

    //  Fixed return value (true instead of True)
    async isAd(element) {
        if (!this.model) return true; // Fixed case
        // TODO: Implement ML logic here
    }

    //  Improved replacement widget (Motivational Quote)
    createReplacementWidget() {
        const widget = document.createElement("div");
        widget.className = "adfriend-widget";
        widget.innerHTML = `
            <div class="widget-content">
                <h3>Motivational Quote</h3>
                <p>"The only limit is your imagination."</p>
            </div>
        `;
        return widget;
    }
}

// Make AdBlock globally accessible

window.AdBlock = AdBlock; // Attach to the global window object
console.log("Adblock mounted")
