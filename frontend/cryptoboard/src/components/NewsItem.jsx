import React from 'react';

const NewsCard = ({ imageSrc, title, link, date, source }) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden max-w-sm custom-bg flex flex-col h-full">
      {/* Image */}
      <img src={imageSrc} alt={title} className="w-full h-36 object-cover" />
      
      <div className="p-4">
        {/* Title as a Link */}
        <a 
          href={link} 
          className="text-md font-semibold active-link-color hover:underline block mb-2"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <div className="flex-grow"></div>
        {/* Date and Source */}
        <div className="text-sm text-gray-500 mt-auto">
          <p>{date}</p>
          <p>{source}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
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
