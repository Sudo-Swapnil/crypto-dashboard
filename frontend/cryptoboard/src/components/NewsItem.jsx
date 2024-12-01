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