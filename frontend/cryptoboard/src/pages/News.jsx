import React, { useState, useEffect } from 'react';
import NewsItem from '../components/NewsItem';  // Import the NewsItem component
import newsImage1 from '../images/stockphoto1.jpg';
import newsImage2 from '../images/stockphoto2.jpg';
import newsImage3 from '../images/stockphoto3.jpg';

const News = () => {
  const [newsData, setNewsData] = useState([
    {
      image: newsImage1,
      title: 'Breaking News 1',
      website: 'https://example.com/news1',
    },
    {
      image: newsImage2,
      title: 'Breaking News 2',
      website: 'https://example.com/news2',
    },
    {
      image: newsImage3,
      title: 'Breaking News 3',
      website: 'https://example.com/news3',
    },
    
  ]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  return (
    <div>
      <div className="news-list" style={styles.newsList}>
        {newsData.length > 0 ? (
          newsData.map((newsItem, index) => (
            <NewsItem
              key={index}
              image={newsItem.image}
              title={newsItem.title}
              website={newsItem.website}
            />
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>
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