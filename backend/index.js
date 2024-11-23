const axios = require('axios');

// Reddit API credentials
const clientId = 'ex5jHV0CUz950ypMgRbmfw';
const clientSecret = 'D1yMKiq6vXINnBUFDVA2tobjVH3SKg';

// Function to get an access token
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

// Function to fetch posts by keyword
async function fetchRedditPosts(keyword) {
    try {
        const token = await getAccessToken();
        const response = await axios.get(
            `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=10`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'User-Agent': 'RedditPostFetcher/1.0',
                },
            }
        );
        return response.data.data.children.map(post => post.data);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }
}

// Main function
(async () => {
    const keyword = 'crypto'; // Replace with your desired keyword
    const posts = await fetchRedditPosts(keyword);
    console.log('Top posts for keyword:', keyword);
    posts.forEach(post => {
        console.log(`- ${post.title} (URL: ${post.url})`);
    });
})();
