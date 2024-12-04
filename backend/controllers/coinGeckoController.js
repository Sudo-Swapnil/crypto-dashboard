const axios = require('axios');
const { COINGECKO_API_URL, API_KEY } = process.env;

// Search for coins by query (name, symbol)
const searchCoins = async (req, res) => {
    const searchQuery = req.query.query;
    const url = `${COINGECKO_API_URL}/search?query=${searchQuery}`;
    try {
        const response = await axios.get(url);
        res.json(response.data); // Send the search data as JSON
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
        res.status(500).json({ message: 'Error fetching data from CoinGecko' });
    }
};

// Get coin details by coinId (e.g., bitcoin)
const getCoinData = async (req, res) => {
    const { coin } = req.params;

    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/${coin}?x_cg_demo_api_key=${API_KEY}`, {
            params: {
                localization: false,
                tickers: false,
                community_data: false,
                developer_data: false,
                sparkline: true,
            },
        });

        const data = response.data;
        const filteredData = {
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            categories: data.categories,
            description: data.description.en,
            homeurl: data.links.homepage[0],
            whitepaper: data.links.whitepaper,
            twitter: data.links.twitter_screen_name,
            facebook: data.links.facebook_username,
            github: data.links.repos_url.github[0],
            icon: data.image.small,
            votes_up: data.sentiment_votes_up_percentage,
            votes_down: data.sentiment_votes_down_percentage,
            market_cap_rank: data.market_data.market_cap_rank,
            sparkline: data.market_data.sparkline_7d.price,
            market_data: {
                current_price: data.market_data.current_price.usd,
                current_price_btc: data.market_data.current_price.btc,
                ath: data.market_data.ath.usd,
                ath_change: data.market_data.ath_change_percentage.usd,
                ath_date: data.market_data.ath_date.usd,
                atl: data.market_data.atl.usd,
                atl_change: data.market_data.atl_change_percentage.usd,
                atl_date: data.market_data.atl_date.usd,
                market_cap: data.market_data.market_cap.usd,
                fully_dilluted_value: data.market_data.fully_diluted_valuation.usd,
                total_volume: data.market_data.total_volume.usd,
                high_24h: data.market_data.high_24h.usd,
                low_24h: data.market_data.low_24h.usd,
                price_change_24h: data.market_data.price_change_percentage_24h,
                price_change_btc_24h: data.market_data.price_change_percentage_24h_in_currency.btc,
                total_supply: data.market_data.total_supply,
                max_supply: data.market_data.max_supply,
                circulating_supply: data.market_data.circulating_supply
            },
        };

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching coin data:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Unable to fetch coin data',
            message: error.message,
        });
    }
};

// Get market chart data for a specific cryptoId
const getMarketChart = async (req, res) => {
    const { cryptoId } = req.params;
    const { days } = req.query;

    const url = `${COINGECKO_API_URL}/coins/${cryptoId}/market_chart?x_cg_demo_api_key=${API_KEY}`;

    try {
        const response = await axios.get(url, {
            params: {
                vs_currency: 'usd',
                days: days || 1 // Default to 1 day if no value is provided
            }
        });
        res.json(response.data); // Send the market chart data as JSON
    } catch (error) {
        console.error('Error fetching market chart data:', error);
        res.status(500).json({ message: 'Error fetching market chart data' });
    }
};

// Get OHLC data for a specific cryptoId
const getOHLC = async (req, res) => {
    const { cryptoId } = req.params;
    const { days } = req.query;

    const url = `${COINGECKO_API_URL}/coins/${cryptoId}/ohlc?x_cg_demo_api_key=${API_KEY}`;

    try {
        const response = await axios.get(url, {
            params: {
                vs_currency: 'usd',
                days: days || 1 // Default to 1 day if no value is provided
            }
        });
        res.json(response.data); // Send the OHLC data as JSON
    } catch (error) {
        console.error('Error fetching OHLC data:', error);
        res.status(500).json({ message: 'Error fetching OHLC data' });
    }
};

module.exports = {
    searchCoins,
    getCoinData,
    getMarketChart,
    getOHLC
};
