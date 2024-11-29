// const axios = require('axios');

// // Reddit API credentials
// const clientId = 'ex5jHV0CUz950ypMgRbmfw';
// const clientSecret = 'D1yMKiq6vXINnBUFDVA2tobjVH3SKg';

// // Function to get an access token
// async function getAccessToken() {
//     const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//     try {
//         const response = await axios.post(
//             'https://www.reddit.com/api/v1/access_token',
//             new URLSearchParams({
//                 grant_type: 'client_credentials',
//             }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error fetching access token:', error.message);
//         throw error;
//     }
// }

// // Function to fetch posts by keyword
// async function fetchRedditPosts(keyword) {
//     try {
//         const token = await getAccessToken();
//         const response = await axios.get(
//             `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=10`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'User-Agent': 'RedditPostFetcher/1.0',
//                 },
//             }
//         );
//         return response.data.data.children.map(post => post.data);
//     } catch (error) {
//         console.error('Error fetching posts:', error.message);
//         throw error;
//     }
// }

// // Main function
// (async () => {
//     const keyword = 'crypto'; // Replace with your desired keyword
//     const posts = await fetchRedditPosts(keyword);
//     console.log('Top posts for keyword:', keyword);
//     posts.forEach(post => {
//       console.log('---');
//       console.log(`- Title: ${post.title}`);
//       console.log(`- Description: ${post.selftext || '(No description available)'}`);
//       console.log(`- URL: ${post.url}`);
//       console.log('---');
//   });
// })();

const express = require('express');
const cors = require("cors");
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
// Route to get a list of cryptocurrencies



app.get('/api/coingecko/search', async (req, res) => {
    const searchQuery = req.query.query
    const url = `https://api.coingecko.com/api/v3/search?query=${searchQuery}`;
  
    try {
      const response = await axios.get(url);
      res.json(response.data); // Send the search data as JSON
    } catch (error) {
      console.error('Error fetching data from CoinGecko:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
