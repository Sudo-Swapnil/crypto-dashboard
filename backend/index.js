const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const newsRoutes = require('./routes/newsRoutes');
const coinGeckoRoutes = require('./routes/coingeckoRoutes');
const app = express();
const PORT = process.env.PORT || 8080;

require('dotenv').config()
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/coingecko', coinGeckoRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });