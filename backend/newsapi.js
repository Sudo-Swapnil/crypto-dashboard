const axios = require('axios');

async function fetchNewsArticles(keyword) {
    const API_URL = 'https://newsapi.org/v2/everything';
    const API_KEY = process.env.NEWSAPI_KEY;

    try {
        const response = await axios.get(API_URL, {
            params: {
                q: keyword,             // Use the keyword received
                apiKey: API_KEY,        // API key
                searchIn: 'title',      // Search in titles only
                sortBy: 'publishedAt',  // Sort by latest
                language: 'en'          // Language: English
            }
        });

        return response.data.articles; // Return the articles
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}

module.exports = fetchNewsArticles;