// const axios = require('axios');

// // Reddit API credentials
// const clientId = 'ex5jHV0CUz950ypMgRbmfw';
// const clientSecret = 'D1yMKiq6vXINnBUFDVA2tobjVH3SKg';

// // Function to get an access token
// async function getAccessToken() {
//     const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//     try {
//         const response = await axios.post(
//             'https://www.reddit.com/api/v1/access_token',
//             new URLSearchParams({
//                 grant_type: 'client_credentials',
//             }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error fetching access token:', error.message);
//         throw error;
//     }
// }

// // Function to fetch posts by keyword
// async function fetchRedditPosts(keyword) {
//     try {
//         const token = await getAccessToken();
//         const response = await axios.get(
//             `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=10`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'User-Agent': 'RedditPostFetcher/1.0',
//                 },
//             }
//         );
//         return response.data.data.children.map(post => post.data);
//     } catch (error) {
//         console.error('Error fetching posts:', error.message);
//         throw error;
//     }
// }

// // Main function
// (async () => {
//     const keyword = 'crypto'; // Replace with your desired keyword
//     const posts = await fetchRedditPosts(keyword);
//     console.log('Top posts for keyword:', keyword);
//     posts.forEach(post => {
//       console.log('---');
//       console.log(`- Title: ${post.title}`);
//       console.log(`- Description: ${post.selftext || '(No description available)'}`);
//       console.log(`- URL: ${post.url}`);
//       console.log('---');
//   });
// })();

const express = require('express');
const cors = require("cors");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

//Search for Cryptocurrency
app.get('/api/coingecko/search', async (req, res) => {
    const searchQuery = req.query.query
    const url = `https://api.coingecko.com/api/v3/search?query=${searchQuery}`;
  
    try {
      const response = await axios.get(url);
      res.json(response.data); // Send the search data as JSON
    } catch (error) {
      console.error('Error fetching data from CoinGecko:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });


  app.get('/api/coingecko/:coin', async (req, res) => {
    const { coin } = req.params;
    console.log(coin)
    try {
        // Fetch data from CoinGecko API
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coin}`,
            {
                params: {
                    localization: false,
                    tickers: false,
                    community_data: false,
                    developer_data: false,
                    sparkline: false,
                },
            }
        );

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
            icon: data.image.thumb,
            votes_up: data.sentiment_votes_up_percentage,
            votes_down: data.sentiment_votes_down_percentage,
            market_cap_rank: data.market_data.market_cap_rank,
            market_data: {
                current_price: data.market_data.current_price.usd,
                ath:data.market_data.ath.usd,
                ath_change: data.market_data.ath_change_percentage.usd,
                ath_date: data.market_data.ath_date.usd,
                atl: data.market_data.atl.usd,
                atl_change: data.market_data.atl_change_percentage.usd,
                atl_date: data.market_data.atl_date.usd, 
                market_cap: data.market_data.market_cap.usd,
                fully_dilluted_value: data.market_data.fully_diluted_valuation.usd,
                total_volume: data.market_data.total_volume.usd,
                high_24h: data.market_data.high_24h.usd,
                low_24h : data.market_data.low_24h.usd, 
                price_change_24h : data.market_data.price_change_percentage_24h,
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
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


