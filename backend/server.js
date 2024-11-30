require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fetchNewsArticles = require('./newsapi');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const API_KEY = process.env.NEWSAPI_KEY;


app.post('/news', async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }
    try{
        const articles = await fetchNewsArticles(keyword)
        res.json({articles})
    } catch(error){
        res.status(500).json({ error: error.message });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

