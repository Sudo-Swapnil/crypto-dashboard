const axios = require('axios');
const { getAccessToken } = require('./redditAPI');

const fetchRedditPosts = async (query) => {
  const token = await getAccessToken();

  const response = await axios.get(`https://www.reddit.com/r/cryptocurrency/search.json?q=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data.data.children.map(post => ({
    title: post.data.title,
    url: post.data.url,
    score: post.data.score,
  }));
};

module.exports = fetchRedditPosts;
