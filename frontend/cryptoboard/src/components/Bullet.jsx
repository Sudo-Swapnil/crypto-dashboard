import React from "react";

const Bullet = ({ title, data }) => {
  return (
    <div>
      {/* Market Cap */}
      <div className="flex justify-between">
        <span className="text-lg font-medium text-gray-400">{title}</span>
        <span className="text-xl font-semibold text-white">
          {title.toLowerCase().includes("supply") 
            ? data?.toLocaleString() 
            : `$${data?.toLocaleString()}`}
        </span>
      </div>
      <hr className="my-2 border-gray-800" />
    </div>
  );
};

export default Bullet;
