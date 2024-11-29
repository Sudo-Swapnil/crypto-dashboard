const axios = require('axios');

// Function to search coins by keyword
async function searchCoins(keyword) {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(keyword)}`
        );
        return response.data.coins; // Returns an array of matching coins
    } catch (error) {
        console.error('Error searching coins:', error.message);
        throw error;
    }
}

// Function to fetch detailed coin data by ID
async function fetchCoinDetails(coinId) {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        return response.data; // Returns detailed information about the coin
    } catch (error) {
        console.error(`Error fetching details for coin ID "${coinId}":`, error.message);
        throw error;
    }
}

// Main function
(async () => {
    const keyword = 'bitcoin'; // Replace with your search keyword]

    // Search for coins
    const coins = await searchCoins(keyword);
    if (coins.length === 0) {
        console.log('No coins found for the given keyword.');
        return;
    }

    coins.forEach((coin, index) => {
        console.log(`${index + 1}. Name: ${coin.name}, Symbol: ${coin.symbol}, ID: ${coin.id}`);
    });

    const coinDetails = await fetchCoinDetails(coins[0].id);
    console.log(`Post: ${JSON.stringify(coinDetails, null, 2)}`);

})();
