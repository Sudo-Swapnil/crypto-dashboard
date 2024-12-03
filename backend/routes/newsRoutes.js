const express = require('express');
const { getNewsSources, getNews } = require('../controllers/newsController');
const authenticateToken = require("../middleware/authMiddleware") 
const router = express.Router();

// Route to fetch news sources
router.get('/',authenticateToken,getNews)
router.get('/sources', authenticateToken, getNewsSources);

module.exports = router;
