import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsItem'; // Import the NewsCard component
import Select from 'react-select';

const News = () => {

  const categoryOptions = [
    { value: 'wallstreet', label: 'The Wall Street Journal' },
    { value: 'tbloomberg', label: 'Bloomberg' },
    { value: 'nyt', label: 'The New York Times' },
    { value: 'reddit', label: 'Reddit' },
  ];

  const [articles, setArticles] = useState([]); // State to hold fetched articles
  const [query, setQuery] = useState(''); // State to hold the search query
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [selectedCategories, setSelectedCategories] = useState(categoryOptions.map(option => option.value));

  useEffect(() => {
    // Fetch news data when the component loads or the query changes
    const fetchNews = async () => {
      setLoading(true);
      try {

        // const response = await fetch(`http://localhost:8080/api/news?query=${query}`);
        // const data = await response.json();
        // setArticles(data.articles.slice(0, 12)); // Limit to 12 articles

        // const newsResponse = await fetch(`http://localhost:8080/api/news?query=${query}`);
        // const newsData = await newsResponse.json();
        
        // // Fetch Reddit posts
        // const redditResponse = await fetch(`http://localhost:8080/api/reddit-posts/search?query=${query}`);
        // const redditData = await redditResponse.json();
        
        // // Combine both data sets (limit to 12 articles)
        // const combinedArticles = [
        //   ...newsData.articles.slice(0, 6), // Limit news articles to 6
        //   ...redditData.posts.slice(0, 6), // Limit Reddit posts to 6
        // ];

        // setArticles(combinedArticles);
        let combinedArticles = []
        
        const sliceLimit = selectedCategories.includes('reddit') && selectedCategories.length > 1 ? 6 : 12;

        if (selectedCategories.some(category => ['wallstreet', 'tbloomberg', 'nyt'].includes(category))) {
          const newsResponse = await fetch(`http://localhost:8080/api/news?query=${query}`);
          const newsData = await newsResponse.json();
          combinedArticles = [
            ...combinedArticles,
            ...newsData.articles.slice(0, sliceLimit), // Limit to 6 articles
          ];
        }
    
        // Fetch Reddit posts if 'reddit' category is selected
        if (selectedCategories.includes('reddit')) {
          const redditResponse = await fetch(`http://localhost:8080/api/reddit-posts/search?query=${query}`);
          const redditData = await redditResponse.json();
          combinedArticles = [
            ...combinedArticles,
            ...redditData.posts.slice(0, sliceLimit), // Limit to 6 Reddit posts
          ];
        }
        combinedArticles = combinedArticles.slice(0, 12);
        setArticles(combinedArticles);

      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, selectedCategories]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };
  // Handle multi-select change
  const handleSelectChange = (selectedOptions) => {
    const categories = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCategories(categories);
  };


  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#2d2d2d', // Dark background for control
      borderColor: '#4B4B4B', // Dark border
      borderRadius: '9999px', // Rounded corners
      padding: '0.5rem',
      color: '#FFFFFF', // White text
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#2d2d2d', // Dark background for dropdown
      borderRadius: '8px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4B4B4B' : state.isFocused ? '#3a3a3a' : '#2d2d2d', // Adjust option background
      color: '#FFFFFF', // White text color for options
      padding: '10px',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#FFFFFF', // White text for selected value
    }),
    placeholder: (base) => ({
      ...base,
      color: '#A1A1A1', // Lighter color for placeholder
    }),
  };

  return (
    <div>
      <Select
          isMulti
          name="categories"
          options={categoryOptions}
          className="react-select-container mt-4" 
          value={categoryOptions.filter(option => selectedCategories.includes(option.value))}
          onChange={handleSelectChange}
          placeholder="Select categories"
          styles={customStyles}
        />
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

// Styling for side-by-side layout

const styles = {
  newsList: {
    display: 'grid',  // Use grid for better control over layout
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',  // This ensures the items adjust based on screen size
    gap: '10px',  // Set gap between items (adjust this as needed)
    margin: 0,
    padding: 0,
  },
  newsItem: {
    borderRadius: '8px',  // Optional: Adds rounded corners
    overflow: 'hidden',  // Optional: Ensures content is clipped to the container's shape
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Optional: Adds subtle shadow to news items
  },
};

export default News;
