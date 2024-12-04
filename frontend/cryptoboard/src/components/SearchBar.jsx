import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//TODO: Add Debouncing...
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setResults([]);
    } else {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:8080/api/coingecko/search?query=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setResults(data.coins || []);
      } catch (error) {
        console.error("Error fetching search data:", error);
        setResults([]); // Handle error by clearing results
      }
    }
  };

  const handleItemClick = (coinId) => {
    // Navigate to the coin's page
    navigate(`/${coinId}`);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 mb-16">
      <div className="relative">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full py-3 pl-4 pr-10 text-sm text-white-700 custom-bg rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 right-3 flex items-center">
          <img
            src="/icons/magnifying-glass.svg"
            alt="Search"
            className="w-5 h-5 text-gray-500"
          />
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <ul
          className="mt-4 custom-bg rounded-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
        >
          {results.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 text-white-700 hover:bg-gray-800 cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              {item.name} ({item.symbol}) {/* Displaying symbol */}
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {searchQuery.trim() !== "" && results.length === 0 && (
        <p className="mt-4 text-sm text-white-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchBar;
