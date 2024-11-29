import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// Register required ChartJS components and zoom plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const [cryptoDescription, setCryptoDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeSpan, setTimeSpan] = useState("7");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const API_KEY = "CG-u5umdoZhxmgxy6imJGfGz29L"; // Your API key

  const searchResultsRef = useRef(null); // Reference to search results container

  const timeSpanOptions = [
    { value: "1", label: "1 Day" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "365", label: "1 Year" },
  ];

  // Fetch cryptocurrency data based on the selected time span
  const fetchCryptoData = async (cryptoId, days) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCryptoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch additional cryptocurrency information
  const fetchCryptoInfo = async (cryptoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}?x_cg_demo_api_key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCryptoInfo(data);
      setCryptoDescription(data.description.en); // Set the English description
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results from the CoinGecko API
  const searchCryptos = async (query) => {
    if (!query) return setSearchResults([]);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );
      const data = await response.json();
      setSearchResults(data.coins);
    } catch (err) {
      console.error(err.message);
    }
  };

  // UseEffect hook to fetch data when selectedCrypto or timeSpan changes
  useEffect(() => {
    fetchCryptoData(selectedCrypto, timeSpan);
    fetchCryptoInfo(selectedCrypto);
  }, [selectedCrypto, timeSpan]);

  // Close search results if clicked outside
  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setSearchResults([]); // Close search results if clicked outside
    }
  };

  // Add event listener for clicks outside search results container
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchCryptos(query); // Trigger search as the user types
  };

  // Handle selection of a cryptocurrency from search results
  const handleSearchSelect = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setSearchQuery(""); // Clear the search bar
    setSearchResults([]); // Clear the search results
  };

  // Prepare data for chart
  const chartData = {
    labels: cryptoData ? cryptoData.prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString()) : [],
    datasets: [
      {
        label: `${selectedCrypto} Price (USD)`,
        data: cryptoData ? cryptoData.prices.map(([_, price]) => price) : [],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  // Chart options with zoom and pan configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
          speed: 10,
        },
        zoom: {
          enabled: true,
          mode: "xy",
          speed: 0.1,
          sensitivity: 3,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        ticks: {
          beginAtZero: false,
        },
      },
    },
  };

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", margin: 0, padding: 0 }}>
      <nav style={{ background: "linear-gradient(45deg, #4a90e2, #50e3c2)", color: "white", padding: "10px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Crypto Dashboard</h1>
      </nav>

      <main style={{ padding: "20px", textAlign: "center" }}>
        {/* Centered Search bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a cryptocurrency..."
            style={{ width: "50%", padding: "10px", fontSize: "16px", borderRadius: "5px", color: "black" }}
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div ref={searchResultsRef} style={{ maxHeight: "200px", overflowY: "auto", marginTop: "10px", padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "5px", width: "50%", margin: "0 auto" }}>
            {searchResults.map((crypto) => (
              <div
                key={crypto.id}
                style={{ padding: "10px", cursor: "pointer", color: "black" }}
                onClick={() => handleSearchSelect(crypto.id)}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#c4c2c2"} // Hover effect
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"} // Remove hover effect
              >
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </div>
            ))}
          </div>
        )}

{/* Display Chart and Crypto Info */}
{loading && <p>Loading data for {selectedCrypto}...</p>}
{error && <p>Error: {error}</p>}
<div style={{paddingLeft:"30px", paddingRight:"30px"}}>
{cryptoData && (
  <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px", alignItems: "center" }}>
    {/* Crypto Info on the Left */}
    <h1>
    {cryptoInfo && (
      <div
      style={{
        width: "300px",
        height:"400px", // Adjust width to your preference
        padding: "20px",
        backgroundColor: "black",
        color: "white",
        borderRadius: "8px",
        marginRight: "20px",
        border: "2px solid #fff", // Border around the card
        margin: "10 auto", // Center the card
        alignItems: "center",
        paddingTop:"100px",
      }}
      >
        <h2 style={{fontSize:"24px"}}><strong>{cryptoInfo.name} Information</strong></h2>
        <h2 style={{fontSize:"18px"}}><strong>Current Price:</strong> ${cryptoInfo.market_data.current_price.usd}</h2>
        <p style={{fontSize:"18px"}}>
          <strong>24-Hour Change: </strong>
          {cryptoInfo.market_data.price_change_percentage_24h ? (
            <span style={{ color: cryptoInfo.market_data.price_change_percentage_24h < 0 ? "red" : "green" }}>
              {cryptoInfo.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          ) : (
            <span>N/A</span>
          )}
        </p>
        <p style={{fontSize:"18px"}}><strong>Market Cap:</strong> ${cryptoInfo.market_data.market_cap.usd}</p>
        <p style={{fontSize:"18px"}}><strong>Total Supply:</strong> {cryptoInfo.market_data.total_supply}</p>
      </div>
    )}
    </h1>

    {/* Display Chart on the Right */}
    <div style={{ width: "70%" }}>
      <h3 style={{fontSize:"24px"}}>{selectedCrypto} Prices ({timeSpanOptions.find(o => o.value === timeSpan)?.label})</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  </div>
)}
</div>
{/* Time Span Dropdown */}
<div style={{ margin: "20px" , fontSize: "24px"}}>
  <label htmlFor="timeSpanDropdown">Select Time Span: </label>
  <select
    id="timeSpanDropdown"
    value={timeSpan}
    onChange={(e) => setTimeSpan(e.target.value)}
    style={{ backgroundColor: "black", color: "white", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
  >
    {timeSpanOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
<div style={{ border: "2px solid white", padding: "15px", borderRadius: "8px" }}>
  <h1 style={{ fontSize: "24px" }}><strong>Description:</strong></h1>
  <p style={{ fontSize: "18px" }}>{cryptoDescription}</p>
</div>


      </main>
    </div>
  );
};

export default Dashboard;
