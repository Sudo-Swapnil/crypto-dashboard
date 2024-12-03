const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  holdings: [
    {
      coinId: { type: String, required: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
      purchaseDate: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
