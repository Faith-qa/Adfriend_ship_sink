import OpenAI from "openai";

const openai = new OpenAI();
const responseCache = new Map(); // Store responses
const MAX_CACHE_SIZE = 30; // Limit to 30 responses

async function generateSpiritualQuote(roleDescription) {
    if (responseCache.has(roleDescription)) {
        console.log("Fetching from cache...");
        return responseCache.get(roleDescription);
    }

    console.log("Fetching from OpenAI...");
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: `You are a ${roleDescription} leader` },
            {
                role: "user",
                content: "Write an encouraging quote from your Bible",
            },
        ],
    });

    const response = completion.choices[0].message.content;

    // Add to cache
    responseCache.set(roleDescription, response);

    // Maintain max cache size
    if (responseCache.size > MAX_CACHE_SIZE) {
        const firstKey = responseCache.keys().next().value; // Get the oldest key
        responseCache.delete(firstKey); // Remove the oldest entry
    }

    return response;
}

// Example Usage
generateSpiritualQuote("Christian").then(console.log);
generateSpiritualQuote("Buddhist").then(console.log);
