const express = require('express');
const { addHolding, getPortfolio, updateHolding, deleteHolding, calculatePortfolioValue } = require('../controllers/portfolioController');
const authenticateToken = require("../middleware/authMiddleware") // Assuming you have an authentication middleware
const router = express.Router();

// Create a new holding or add it to the portfolio
router.post('/', authenticateToken, addHolding);

// Get the user's portfolio
router.get('/', authenticateToken, getPortfolio);

// Update an existing holding in the portfolio
router.put('/:coinId', authenticateToken, updateHolding);

// Delete a holding from the portfolio
router.delete('/:coinId', authenticateToken, deleteHolding);

// Calculate the total value of the portfolio
router.get('/value', authenticateToken, calculatePortfolioValue);

module.exports = router;
