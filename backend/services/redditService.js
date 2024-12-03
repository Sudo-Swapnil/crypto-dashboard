const axios = require('axios');


async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  try {
      const response = await axios.post(
          'https://www.reddit.com/api/v1/access_token',
          new URLSearchParams({
              grant_type: 'client_credentials',
          }),
          {
              headers: {
                  Authorization: `Basic ${auth}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
          }
      );
      return response.data.access_token;
  } catch (error) {
      console.error('Error fetching access token:', error.message);
      throw error;
  }
}

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
