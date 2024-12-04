const axios = require('axios');
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET


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


const fetchRedditPosts = async (keyword) => {
  try {
      const token = await getAccessToken();
      const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=10`;
      const headers = {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'RedditPostFetcher/1.0',
      };

      const { data } = await axios.get(url, { headers });

      // Extract relevant information from posts
      const articles = data.data.children.map(post => ({
          source: post.data.subreddit_name_prefixed, // Subreddit where the post is published
          author: post.data.author, // Author of the post
          title: post.data.title, // Title of the post
          description: post.data.selftext || '(No description available)', // Self-text or fallback
          url: post.data.url, // URL to the post
          image: post.data.thumbnail !== 'self' ? post.data.thumbnail : null, // Thumbnail if available
          publishedAt: new Date(post.data.created_utc * 1000).toISOString(), // Convert UTC timestamp to ISO date
          content: post.data.selftext, // Full content of the post (if available)
      }));

      return articles;
  } catch (err) {
      throw new Error(`Failed to fetch Reddit posts: ${err.message}`);
  }
};


module.exports = fetchRedditPosts;
