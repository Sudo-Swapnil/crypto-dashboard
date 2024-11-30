import React from 'react';

const NewsItem = ({ image, title, website }) => {
  return (
    <div className="news-item" style={styles.newsItem}>
      <img src={image} alt={title} style={styles.image} />
      <h3 style={styles.title}>{title}</h3>
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        {website}
      </a>
    </div>
  );
};

const styles = {
  newsItem: {
    borderRadius: '20px',
    padding: '12px',
    margin: '6px 0',
    backgroundColor: '#1c1c26',
    maxWidth: '350px', // Adding a maximum width for smaller size
    maxWidth: '400px',    // Adjust the maximum width
    minWidth: '150px',    // Set a minimum width
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '6px',
  },
  title: {
    fontSize: '1rem', // Smaller font size
    fontWeight: 'bold',
    marginTop: '8px',
    marginBottom: '6px',
  },
  link: {
    color: '#0073e6',
    textDecoration: 'none',
    fontSize: '0.8rem', // Smaller font size for the link
    marginTop: '6px',
    display: 'inline-block',
  },
};

export default NewsItem;
