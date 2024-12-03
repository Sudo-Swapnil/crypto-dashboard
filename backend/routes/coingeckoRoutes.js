const express = require('express');
const { searchCoins, getCoinData, getMarketChart, getOHLC } = require('../controllers/coinGeckoController');
const authenticateToken = require("../middleware/authMiddleware")
const router = express.Router();

// Search for coins by query (e.g., `/api/coingecko/search?query=bitcoin`)
router.get('/search', authenticateToken, searchCoins);

// Get coin details by coinId (e.g., `/api/coingecko/bitcoin`)
router.get('/:coin', authenticateToken, getCoinData);

// Get market chart data for a specific cryptoId (e.g., `/api/coingecko/bitcoin/market_chart?days=7`)
router.get('/:cryptoId/market_chart', authenticateToken, getMarketChart);

// Get OHLC data for a specific cryptoId (e.g., `/api/coingecko/bitcoin/ohlc?days=7`)
router.get('/:cryptoId/ohlc', authenticateToken, getOHLC);

module.exports = router;
