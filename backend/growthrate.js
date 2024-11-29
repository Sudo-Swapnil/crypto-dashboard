const axios = require('axios');

// Function to fetch historical data for a cryptocurrency
async function fetchHistoricalData(coinId, days) {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
            {
                params: {
                    vs_currency: 'usd',
                    days: days,
                },
            }
        );
        return response.data.prices; // Array of [timestamp, price]
    } catch (error) {
        console.error(`Error fetching historical data for ${coinId}:`, error.message);
        throw error;
    }
}

// Function to calculate growth rate
function calculateGrowthRate(prices) {
    if (prices.length < 2) {
        return null; // Not enough data to calculate growth
    }

    const initialPrice = prices[0][1]; // Price at the start
    const finalPrice = prices[prices.length - 1][1]; // Price at the end

    const growthRate = ((finalPrice - initialPrice) / initialPrice) * 100;
    return growthRate.toFixed(2); // Format to 2 decimal places
}

// Main function
(async () => {
    const coins = ['bitcoin', 'ethereum', 'dogecoin']; // List of cryptocurrencies to analyze
    const days = 365; // Time period in days (e.g., last 365 days)

    console.log(`Growth Rates Over the Last ${days} Days:\n`);

    for (const coin of coins) {
        console.log(`Fetching data for ${coin}...`);
        const prices = await fetchHistoricalData(coin, days);
        const growthRate = calculateGrowthRate(prices);

        if (growthRate !== null) {
            console.log(`${coin.toUpperCase()}: ${growthRate}%`);
        } else {
            console.log(`${coin.toUpperCase()}: Not enough data available.`);
        }
    }
})();
