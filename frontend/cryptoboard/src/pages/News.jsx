import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select for the dropdown
import NewsCard from '../components/NewsItem'; // Import the NewsCard component

const News = () => {
  const [articles, setArticles] = useState([]); // State to hold fetched articles
  const [query, setQuery] = useState(''); // State to hold the search query
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to handle errors
  const [sources, setSources] = useState([]); // State to hold available sources
  const [selectedSources, setSelectedSources] = useState([]); // State for selected sources


  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1C1C25', // Dark blue background for the control
      color: '#f1f5f9', // Light text color
      borderRadius: '9999px',
      border: '0px', // Light gray border
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#94a3b8', // Lighter gray on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1C1C25', // Dark blue background for the dropdown menu
      borderRadius: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#334155' : '#1C1C25',
      color: '#f1f5f9', // Light text color
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#334155', // Slightly lighter blue for selected items
      color: '#f1f5f9',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#f1f5f9', // Light text for selected items
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#f1f5f9',
      '&:hover': {
        backgroundColor: '#062141', // Hover effect on remove button
        color: '#ffffff',
      },
    }),
  };

  useEffect(() => {
    // Fetch available sources
    const fetchSources = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/news/sources`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch sources');
          return;
        }

        const data = await response.json();
        setSources(data.sources.map((source) => ({ label: source.name, value: source.id }))); // Format for react-select
      } catch (err) {
        console.error('Error fetching sources:', err);
      }
    };

    fetchSources();
  }, []);

  useEffect(() => {
    // Fetch news data when the component loads or the query/selectedSources change
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

      if (!token) {
        setError('You are not authorized. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const sourcesParam = selectedSources.map((source) => source.value).join(',');
        const response = await fetch(
          `http://localhost:8080/api/news?query=${query}&sources=${sourcesParam}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized. Please log in again.');
          } else {
            setError('Failed to fetch news. Please try again later.');
          }
          return;
        }

        const data = await response.json();
        console.log("Debugging data", data)
        setArticles(data.articles.slice(0, 12)); // Limit to 12 articles
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('An error occurred while fetching news.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, selectedSources]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      {/* Search and Dropdown */}
      <div className="w-full max-w-4xl mx-auto mt-10 mb-16 flex items-center gap-4">
        <div className="relative flex-grow">
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
        <div className="min-w-[200px]">
          <Select
            isMulti
            options={sources}
            value={selectedSources}
            onChange={(selected) => setSelectedSources(selected)}
            placeholder="Filter by source"
            className="text-sm"
            styles={customStyles}
          />
        </div>
      </div>
      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : articles.length > 0 ? (
        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              imageSrc={article.image || 'placeholder.webp'} // Fallback for missing images
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
