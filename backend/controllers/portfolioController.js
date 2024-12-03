const axios = require('axios');
const Portfolio = require('../models/portfolioModel'); // Assuming Portfolio model is defined elsewhere

// Create a new portfolio or add a holding to an existing portfolio
const addHolding = async (req, res) => {
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
};

// Fetch the user's portfolio
const getPortfolio = async (req, res) => {
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
};

// Update an existing holding in the user's portfolio
const updateHolding = async (req, res) => {
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
};

// Delete a holding from the user's portfolio
const deleteHolding = async (req, res) => {
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
};

// Calculate the total value of the user's portfolio and its purchase value
const calculatePortfolioValue = async (req, res) => {
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
};

module.exports = {
  addHolding,
  getPortfolio,
  updateHolding,
  deleteHolding,
  calculatePortfolioValue,
};
