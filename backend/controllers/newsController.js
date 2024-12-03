const fetchRedditPosts = require('../services/redditService');
const axios = require('axios');
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const getNewsSources = async (req, res) => {
    const { category, language, country } = req.query; // Accept filters as query parameters
  
    const url = `https://newsapi.org/v2/sources`;
  
    try {
      const response = await axios.get(url, {
        params: {
          apiKey: process.env.NEWS_API_KEY, // Make sure to keep your API key in an environment variable
          category: category || '', // Optional: Filter by category
          language: language || 'en', // Default to English
          country: country || 'us', // Default to the US
        },
      });
  
      // Extract relevant information from sources
      const sources = response.data.sources.map((source) => ({
        id: source.id,
        name: source.name,
      }));
      
      // Add Reddit as a news source
      sources.push({ id: 'reddit', name: 'Reddit' });
  
      res.json({ sources }); // Send the formatted sources as JSON
    } catch (error) {
      console.error('Error fetching news sources:', error);
      res.status(500).json({ message: 'Error fetching news sources' });
    }
  };


const getNews = async (req, res) => {
  const { query, sources } = req.query; 

  if (sources && sources.includes('reddit')) {
    try {
      const articles = await fetchRedditPosts(query || 'crypto');
      return res.json({ articles });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching Reddit posts' });
    }
  }

  const url = `https://newsapi.org/v2/everything`;

  try {
    const response = await axios.get(url, {
      params: {
        q: query || 'crypto',
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        sources: sources || '',
      },
    });

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

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news data' });
  }
};

module.exports = { 
    getNewsSources,
    getNews };
