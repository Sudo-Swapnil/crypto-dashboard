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

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require("cors");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

API_KEY = "CG-1qZC5UHpq8NxYAykhMaycGJd" //coingecko
NEWS_API_KEY = "4e288366078447afba129da0c469cee9" 
MONGO_URL = "mongodb+srv://rachita:Rachit2205@cluster0.ixegf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const JWT_SECRET = 'your_jwt_secret';
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required:true, unique:true},
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };


// Routes
app.post('/signup', async (req, res) => {
    console.log(req)
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id,email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/news', authenticateToken, async (req, res) => {
    const { query } = req.query; // Accept 'query' as a query parameter

    const url = `https://newsapi.org/v2/everything`;

    try {
        const response = await axios.get(url, {
            params: {
                q: query || 'crypto', // Default to 'bitcoin' if no query is provided
                apiKey: NEWS_API_KEY,
                searchIn: 'title',
                language: 'en', // Filter for English articles
                sortBy: 'publishedAt', // Sort by latest articles
            },
        });

        // Extract relevant information from articles
        const articles = response.data.articles.map(article => ({
            source: article.source.name,
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.urlToImage,
            publishedAt: article.publishedAt,
            content: article.content,
        }));

        res.json({ articles }); // Send the formatted articles as JSON
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news data' });
    }
});

//Search for Cryptocurrency
app.get('/api/coingecko/search',authenticateToken, async (req, res) => {
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


  app.get('/api/coingecko/:coin',authenticateToken, async (req, res) => {
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
                current_price_btc : data.market_data.current_price.btc, 
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
});

app.get('/api/coingecko/:cryptoId/market_chart',authenticateToken, async (req, res) => {
    const { cryptoId } = req.params;
    const { days } = req.query; // Accept days as a query parameter

    const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?x_cg_demo_api_key=${API_KEY}`;

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
});

app.get('/api/coingecko/:cryptoId/ohlc',authenticateToken, async (req, res) => {
    const { cryptoId } = req.params;
    const { days } = req.query; // Accept days as a query parameter

    const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?x_cg_demo_api_key=${API_KEY}`;

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
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


