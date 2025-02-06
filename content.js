// Wait for the DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
    if (window.AdBlock) {
        console.log("AdBlock class found, initializing...");

        // Create an instance of AdBlock
        const adBlockInstance = new window.AdBlock();
    } else {
        console.error("AdBlock class not found on window!");
    }
});
