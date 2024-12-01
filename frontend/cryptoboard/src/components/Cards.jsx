import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ColorThief from "color-thief-browser";

const Card = ({id,imageSrc, subtitle, title }) => {
  const [dominantColor, setDominantColor] = useState("rgb(255, 255, 255)");
  const navigate = useNavigate();  
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous"; // Important for CORS issues

    img.onload = () => {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img); // Extract dominant color
      dominantColor.push(0.6)
    //   console.log(dominantColor)
      setDominantColor(`rgba(${dominantColor.join(",")})`);
    };
  }, [imageSrc]);

  const gradient = `radial-gradient(circle at top left, ${dominantColor} 30%, rgb(28,28,37) 50%)`;
  const handleCardClick = () => {
    console.log(id)
    navigate(`/${id}`); // Navigate to the /subtitle path
  };
//   console.log(gradient)
  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-lg shadow-md overflow-visible"
      style={{ background: gradient }}
      onClick={handleCardClick}
    >
      {/* Circular Image */}
      <div className="absolute -top-8 left-4">
        <img
          src={imageSrc}
          alt={title}
          className="w-16 h-16 rounded-full  shadow-lg"
          crossOrigin="anonymous" // Needed for cross-origin images
        />
      </div>

      {/* Card Content */}
      <div className="pt-20 px-4 pb-8">
        <p className="text-sm text-gray-800 uppercase">{subtitle}</p>
        <h3 className="mt-1 text-lg font-semibold text-white-900">{title}</h3>
      </div>
    </div>
  );
};

export default Card;
