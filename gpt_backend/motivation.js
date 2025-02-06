const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("");

const quoteCache = new Map();
const MAX_QUOTES_PER_ROLE = 30;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function clearRoleCache(role) {
    for (let [key, value] of quoteCache) {
        if (key.startsWith(role + ":")) { // Check if the key belongs to the role
            quoteCache.delete(key);
        }
    }
}


async function generateQuote(role) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a ${role} leader. Write an encouraging quote from your bible`;
    const cacheKey = role + ":" + prompt; // Add the role to the key

    // Check if the quote is already in the cache
    if (quoteCache.has(cacheKey)) {
        const cachedValue = quoteCache.get(cacheKey);
        if (Date.now() - cachedValue.timestamp < CACHE_DURATION_MS) {
            console.log(`Quote retrieved from cache for ${role}`);
            return cachedValue.quote;
        } else {
            quoteCache.delete(cacheKey); // Expired, remove from cache
        }
    }

    const result = await model.generateContent(prompt);
    const quote = result.response.text();

    // Check the number of quotes for the role
    let roleQuoteCount = 0;
    for (let key of quoteCache.keys()) {
        if (key.startsWith(role + ":")) {
            roleQuoteCount++;
        }
    }

    if (roleQuoteCount >= MAX_QUOTES_PER_ROLE) {
        console.log(`Cache limit reached for ${role}. Recycling...`);
        clearRoleCache(role); // Clear the cache for the role
    }

    quoteCache.set(cacheKey, { quote, timestamp: Date.now() });
    console.log(`Quote generated and stored in cache for ${role}`);
    return quote;
}

// Function to clear the entire cache (e.g., daily)
function clearAllCache() {
    quoteCache.clear();
    console.log("Entire cache cleared.");
}

// Example usage (demonstrates recycling and clearing)
async function test() {
    for (let i = 0; i < 35; i++) { // Generate more than 30 quotes
        const role = "pastor";
        const quote = await generateQuote(role);
        console.log(quote);
    }

    const prophetQuote = await generateQuote("prophet");
    console.log(prophetQuote);

    setTimeout(clearAllCache, CACHE_DURATION_MS); // Clear after 24 hours (in real app, use a scheduler)
}

test();