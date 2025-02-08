const quotes = [
    // Bible Quotes
    {
        type: "Bible Quote",
        text: "\"I can do all things through Christ who strengthens me.\"",
        author: "- Philippians 4:13"
    },
    {
        type: "Bible Quote",
        text: "\"For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.\"",
        author: "- John 3:16"
    },
    {
        type: "Bible Quote",
        text: "\"Trust in the Lord with all your heart and lean not on your own understanding.\"",
        author: "- Proverbs 3:5"
    },
    
    // Quranic Quotes
    {
        type: "Quranic Quote",
        text: "\"Indeed, with hardship comes ease.\"",
        author: "- Quran 94:6"
    },
    {
        type: "Quranic Quote",
        text: "\"And He found you lost and guided you.\"",
        author: "- Quran 93:7"
    },
    {
        type: "Quranic Quote",
        text: "\"So be patient. Indeed, the promise of Allah is truth.\"",
        author: "- Quran 30:60"
    },

    // Buddhist Quotes
    {
        type: "Buddhist Quote",
        text: "\"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.\"",
        author: "- Buddha"
    },
    {
        type: "Buddhist Quote",
        text: "\"Peace comes from within. Do not seek it without.\"",
        author: "- Buddha"
    },
    {
        type: "Buddhist Quote",
        text: "\"Three things cannot be long hidden: the sun, the moon, and the truth.\"",
        author: "- Buddha"
    },

    // Motivational Quotes
    {
        type: "Motivational Quote",
        text: "\"Believe you can and you’re halfway there.\"",
        author: "- Theodore Roosevelt"
    },
    {
        type: "Motivational Quote",
        text: "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"",
        author: "- Winston Churchill"
    },
    {
        type: "Motivational Quote",
        text: "\"Opportunities don't happen. You create them.\"",
        author: "- Chris Grosser"
    },

    // Reminders
    {
        type: "Reminder",
        text: "\"Take a deep breath and stay mindful of the present moment.\"",
        author: ""
    },
    {
        type: "Reminder",
        text: "\"Remember to express gratitude today. It changes everything.\"",
        author: ""
    },
    {
        type: "Reminder",
        text: "\"You are enough. Keep going at your own pace.\"",
        author: ""
    },

    // Healthy Lifestyle Tips
    {
        type: "Healthy Lifestyle Tip",
        text: "\"Start your day with a glass of water to kickstart your metabolism.\"",
        author: ""
    },
    {
        type: "Healthy Lifestyle Tip",
        text: "\"Avoid screens 30 minutes before bed for better sleep quality.\"",
        author: ""
    },
    {
        type: "Healthy Lifestyle Tip",
        text: "\"Incorporate a short walk into your daily routine for better mental and physical health.\"",
        author: ""
    }
];

let currentIndex = 0;
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const contentTypeElement = document.getElementById("content-type");
const iconElement = document.getElementById("icon");

function refreshContent() {
    const randomIndex = Math.floor(Math.random() * quotes.length); // Randomly select an index
    const currentQuote = quotes[randomIndex]; // Get the selected quote
    
    // Update text content
    quoteElement.textContent = currentQuote.text;
    authorElement.textContent = currentQuote.author || ''; // Hide author if not available
    contentTypeElement.textContent = currentQuote.type; // Update the quote type in the UI

    // Define icon sources
    const iconPaths = {
        "Bible Quote": "icons/icon48.png",
        "Motivational Quote": "icons/icon16.png",
        "Quranic Quote": "icons/icon48.png",
        "Buddhist Quote": "icons/icon48.png",
        "Reminder" : "icons/icon128.png",
        "Healthy Lifestyle Tip" : "icons/icon15.png"
    };

    // Set icon based on quote type
    if (iconPaths[currentQuote.type]) {
        iconElement.src = iconPaths[currentQuote.type];
        iconElement.style.display = "block"; // Ensure icon is visible
        console.log(`Icon set to: ${iconElement.src}`);
    } else {
        iconElement.style.display = "none"; // Hide icon for other types
        console.log("No icon displayed.");
    }
}

// Close popup when close button is clicked
closeButton.addEventListener("click", function() {
    widgetContainer.style.display = "none";
    console.log("Popup closed.");
});

// Automatically cycle content every 5 seconds (5000 milliseconds)
setInterval(refreshContent, 5000);

// Initial content load
refreshContent();
