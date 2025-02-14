# Spiritual Ad Blocker Extension

This Chrome Extension replaces advertisements with motivational quotes from various spiritual sources, such as the **Bible**, **Quran**, or **Buddhist Teachings**. It aims to provide a calming, uplifting browsing experience by eliminating ads and displaying encouraging messages at the top of web pages.

---

## Features
- **Ad Blocking:** Replaces intrusive ads with motivational quotes.
- **EasyList Integration:** Blocks ads at the network level using the popular EasyList rules.
- **Dynamic Quote Updates:** Refreshes quotes every 5 seconds to keep the content inspiring.
- **Customizable Sources:** Users can choose their preferred source of motivational quotes (e.g., Bible, Quran, Buddhist Teachings).
- **Strict Blocking Mode:** An option to block all ads dynamically, including those loaded after the page is rendered.
- **Top-of-Page Motivational Banner:** A motivational quote is displayed at the top of the page for constant inspiration.

---

## Installation
1. Clone or download this repository to your local machine.
2. Bundle the app in dist by running `tsc webpack`
2. Open **Chrome** and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** using the toggle in the top-right corner.
4. Click **"Load unpacked"** and select the project folder.
5. The extension will now be loaded and ready to use.

---

## How It Works
1. **Network Blocking with EasyList:**
    - The extension uses Chrome's `declarativeNetRequest` API to block ads at the network level using rules generated from EasyList.
    - Ads are prevented from loading, saving bandwidth and improving page performance.

2. **DOM Manipulation:**
    - After network-level blocking, the extension detects and removes leftover ad containers on the page.
    - It replaces the first detected ad or places a motivational quote at the top of the page.

3. **Dynamic Updates:**
    - Quotes are refreshed every 5 seconds, ensuring a constantly uplifting browsing experience.

4. **User Preferences:**
    - Users can select their preferred spiritual source for quotes.
    - A "Strict Blocking Mode" can be toggled to remove all ads dynamically.

---

