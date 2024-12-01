import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsItem'; // Import the NewsCard component

const News = () => {
  const [articles, setArticles] = useState([]); // State to hold fetched articles
  const [query, setQuery] = useState(''); // State to hold the search query
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    // Fetch news data when the component loads or the query changes
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news?query=${query}`);
        const data = await response.json();
        setArticles(data.articles.slice(0, 12)); // Limit to 12 articles
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
    <div className="w-full max-w-md mx-auto mt-10 mb-16">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-3 pl-4 pr-10 text-sm text-white-700 custom-bg rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={query}
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <img
            src="/icons/magnifying-glass.svg"
            alt="Search"
            className="w-5 h-5 text-gray-500"
          />
        </div>
      </div>
      </div>
      {/* News Cards Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : articles.length > 0 ? (
        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              imageSrc={article.image || '/images/placeholder.jpg'} // Fallback for missing images
              title={article.title}
              link={article.url}
              date={new Date(article.publishedAt).toLocaleDateString()}
              source={article.source}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No articles found.</p>
      )}
    </div>
  );
};

export default News;
