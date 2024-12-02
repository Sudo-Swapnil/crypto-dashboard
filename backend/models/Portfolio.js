const mongoose = require('mongoose');

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
  