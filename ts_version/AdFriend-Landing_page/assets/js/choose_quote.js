document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("quoteModal");
    const btn = document.getElementById("getExtensionBtn");
    const closeBtn = document.querySelector(".close");

    // Open modal when button is clicked
    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Close modal when the close button is clicked
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle select dropdown
    const select = document.getElementById("optionsSelect");
    const displayDiv = document.getElementById("selectedOptionContent");
    const saveButton = document.getElementById("save-changes-btn");

    // Initially disable the save button
    saveButton.disabled = true;

    select.addEventListener("change", function () {
        if (this.value) {
            displayDiv.innerHTML = `<p>You selected: ${this.value}</p>`;
            saveButton.disabled = false; // Enable the save button after a selection
        } else {
            displayDiv.innerHTML = `<p>Please select an option.</p>`;
            saveButton.disabled = true; // Disable the save button if no selection
        }
    });

    // Handle save changes button click
    saveButton.addEventListener("click", function () {
        const selectedOption = select.value;
        if (selectedOption) {
            alert(`Changes saved: ${select.options[select.selectedIndex].text}`);
        } else {
            alert('Please select a quote type before saving.');
        }
    });
});
