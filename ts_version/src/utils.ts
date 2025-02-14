export function getQuotes(source: string): string[] {
    const quotes: { [key: string]: string[] } = {
        bible: [
            "The Lord is my shepherd; I shall not want. - Psalm 23:1",
            "I can do all things through Christ who strengthens me. - Philippians 4:13",
            "Be strong and courageous. Do not be afraid. - Joshua 1:9"
        ],
        quran: [
            "Indeed, Allah is with those who fear Him and those who are doers of good. - Quran 16:128",
            "So verily, with every difficulty, there is relief. - Quran 94:6",
            "Do not despair of the mercy of Allah. - Quran 39:53"
        ],
        buddhist: [
            "Peace comes from within. Do not seek it without. - Buddha",
            "The mind is everything. What you think you become. - Buddha",
            "Radiate boundless love towards the entire world. - Buddha"
        ]
    };
    return quotes[source] || [];
}
