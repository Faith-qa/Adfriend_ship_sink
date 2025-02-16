document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown") as HTMLElement | null;
    const dropbtn = document.querySelector(".dropbtn") as HTMLButtonElement | null;
    const checkUsOutBtn = document.getElementById("check-us-out") as HTMLAnchorElement | null;

    // Ensure essential elements exist
    if (!dropdown || !dropbtn || !checkUsOutBtn) {
        console.error("Required elements not found in the DOM.");
        return;
    }

    // 1. Restore last selected quote (stored as 'source') from storage
    chrome.storage.sync.get("source", (data: { source?: string }) => {
        if (data.source) {
            // Capitalize or format if desired
            dropbtn.textContent = capitalizeFirst(data.source);
        }
    });

    // 2. Toggle dropdown on button click
    dropbtn.addEventListener("click", () => {
        dropdown.classList.toggle("open");
    });

    // 3. Listen for dropdown item clicks
    document.querySelectorAll<HTMLAnchorElement>(".quote-option").forEach((element) => {
        element.addEventListener("click", (event: Event) => {
            event.preventDefault();
            const selectedType = element.getAttribute("data-type"); // bible, quran, etc.

            if (selectedType) {
                // Save selection as 'source'
                chrome.storage.sync.set({ source: selectedType }, () => {
                    // Update the button text
                    dropbtn.textContent = capitalizeFirst(selectedType);
                });
                // Close the dropdown
                dropdown.classList.remove("open");
            }
        });
    });

    // 4. Close dropdown if user clicks outside of it
    document.addEventListener("click", (event: Event) => {
        if (!dropdown.contains(event.target as Node)) {
            dropdown.classList.remove("open");
        }
    });

    // 5. "Check Us Out" -> opens landing page
    checkUsOutBtn.addEventListener("click", (event: Event) => {
        event.preventDefault();
        chrome.tabs.create({ url: chrome.runtime.getURL("AdFriend-Landing_page/index.html") });
    });

    // Helper function to capitalize
    function capitalizeFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
