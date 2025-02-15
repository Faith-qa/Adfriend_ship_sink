document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    const quoteLinks = dropdownContent.querySelectorAll("a");

    // Handle dropdown click to toggle visibility
    dropdown.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent immediate closing when clicking inside
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.style.display = "none";
        }
    });

    // Handle quote selection
    quoteLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent page reload
            dropdown.textContent = this.textContent; // Update button text
            dropdownContent.style.display = "none"; // Hide dropdown after selection
        });
    });
});
