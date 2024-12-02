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

const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    holdings: [
      {
        coinId: { type: String, required: true }, // CoinGecko coin ID
        name: { type: String, required: true },  // e.g., Bitcoin
        symbol: { type: String, required: true }, // e.g., BTC
        quantity: { type: Number, required: true },
        purchasePrice: { type: Number, required: true },
        purchaseDate: { type: Date, default: Date.now },
      },
    ],
  });
  
  const Portfolio = mongoose.model('Portfolio', portfolioSchema);

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
    try {
        // Fetch data from CoinGecko API
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coin}?x_cg_demo_api_key=${API_KEY}`,
            {
                params: {
                    localization: false,
                    tickers: false,
                    community_data: false,
                    developer_data: false,
                    sparkline: true,
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
            icon: data.image.small,
            votes_up: data.sentiment_votes_up_percentage,
            votes_down: data.sentiment_votes_down_percentage,
            market_cap_rank: data.market_data.market_cap_rank,
            sparkline: data.market_data.sparkline_7d.price,
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

app.post('/api/portfolio', authenticateToken, async (req, res) => {
    const { coinId, name, symbol, quantity, purchasePrice } = req.body;
  
    if (!coinId || !quantity || !purchasePrice) {
      return res.status(400).json({ message: 'Coin ID, quantity, and purchase price are required' });
    }
  
    try {
      let portfolio = await Portfolio.findOne({ userId: req.user.id });
        
      if (!portfolio) {
        portfolio = new Portfolio({
          userId: req.user.id,
          holdings: [{ coinId, name, symbol, quantity, purchasePrice }],
        });
      } else {
        portfolio.holdings.push({ coinId, name, symbol, quantity, purchasePrice });
      }
  
      await portfolio.save();
      res.status(201).json({ message: 'Holding added successfully', portfolio });
    } catch (error) {
      console.error('Error adding holding:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/portfolio', authenticateToken, async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });
  
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      res.status(200).json(portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/portfolio/:coinId', authenticateToken, async (req, res) => {
    const { coinId } = req.params;
    const { quantity, purchasePrice } = req.body;
  
    try {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });
  
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      const holding = portfolio.holdings.find((h) => h.coinId === coinId);
  
      if (!holding) {
        return res.status(404).json({ message: 'Holding not found' });
      }
  
      holding.quantity = quantity || holding.quantity;
      holding.purchasePrice = purchasePrice || holding.purchasePrice;
  
      await portfolio.save();
      res.status(200).json({ message: 'Holding updated successfully', portfolio });
    } catch (error) {
      console.error('Error updating holding:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.delete('/api/portfolio/:coinId', authenticateToken, async (req, res) => {
    const { coinId } = req.params;
  
    try {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });
  
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      portfolio.holdings = portfolio.holdings.filter((h) => h.coinId !== coinId);
  
      await portfolio.save();
      res.status(200).json({ message: 'Holding deleted successfully', portfolio });
    } catch (error) {
      console.error('Error deleting holding:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/portfolio/value', authenticateToken, async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });
  
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      const coinIds = portfolio.holdings.map((h) => h.coinId).join(',');
      const response = await axios.get(
       `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
      );
  
      const prices = response.data;
      console.log("Checking fetched prices", prices)
      const totalValue = portfolio.holdings.reduce((acc, holding) => {
        return acc + (holding.quantity * prices[holding.coinId]?.usd || 0);
      }, 0);

      const totalPurchasedValue = portfolio.holdings.reduce((acc, holding) => {
        return acc + (holding.quantity * holding.purchasePrice || 0);
      }, 0);

  
      res.status(200).json({ totalValue, totalPurchasedValue, holdings: portfolio.holdings });
    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


