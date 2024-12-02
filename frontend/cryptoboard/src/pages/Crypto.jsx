import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Bullet from "../components/Bullet";
import CryptoChart from "../components/CryptoChart";
import Change from "../components/ChangeSpan";
const CryptoData = () => {
    const { coin } = useParams(); // Extract coin from URL
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(0); // State to hold quantity
    const [portfolioMessage, setPortfolioMessage] = useState(null); // State to handle response message
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You are not authorized. Please log in.');
          setLoading(false);
          return;
        }
        try {
          const response = await fetch(`http://localhost:8080/api/coingecko/${coin}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          });
          if (!response.ok) {
            if (response.status === 401) {
              setError('Unauthorized. Please log in again.');
            } else {
              setError('Failed to fetch data. Please try again later.');
            }
            return;
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message || "Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [coin]);

    const handleAddToPortfolio = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not authorized. Please log in.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/api/portfolio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coinId: coin,
            name: data.name,
            symbol: data.symbol,
            quantity: parseFloat(quantity),
            purchasePrice: data.market_data.current_price,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setPortfolioMessage(errorData.message || "Failed to add to portfolio.");
          return;
        }
  
        const result = await response.json();
        console.log(result)
        setPortfolioMessage("Added to portfolio successfully!");
        setIsModalOpen(false);
        setQuantity(0)
      } catch (error) {
        setPortfolioMessage("Failed to add to portfolio. Please try again.");
      }
    };
  
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleBackClick = () => {
      navigate(-1); // Navigate to the previous page
    };

    return (
      <div className="flex">
        
        <div className="md:w-1/3 custom-bg p-6 flex flex-col space-y-4 rounded-lg">
      
          {/* Top Row */}
          <div className="flex items-center space-x-4">
        {/* Logo */}
        <img
          src={data.icon}
          alt={`${data.name} logo`}
          className="w-12 h-12 rounded-full border"
        />
        
        {/* Name, Symbol, and Rank in the same line */}
          <h2 className="text-2xl font-bold">{data.name}</h2>
            <span className="text-sm text-white-600">{data.symbol?.toUpperCase()} price</span>
            <span className="bg-black p-1 rounded-lg text-sm">#{data.market_cap_rank}</span>
      </div>
    
          {/* Bottom Row */}
          <div className="flex items-center space-x-4 mb-2">
            {/* Current Price */}
            <span className="font-semibold text-4xl text-white-700">
              ${data.market_data.current_price?.toLocaleString()}
            </span>
            {/* Change Percentage */}
            <Change
            data = {data.market_data.price_change_24h}
            />
          </div>
          <div className="flex flex-col space-y-4">
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="active-link-bg-color text-white px-2 py-2 rounded-full"
          >
            Add to Portfolio
          </button>
          {portfolioMessage && <p className="text-green-500">{portfolioMessage}</p>}
          {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="custom-bg p-6 rounded shadow-lg space-y-4 w-80">
            <h2 className="text-xl font-bold">Enter Quantity</h2>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 w-full rounded text-black"
              placeholder="Enter quantity"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToPortfolio}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
          <Bullet
         title = 'Market Cap'
         data = {data.market_data.market_cap}
         /> 
         <Bullet
         title = 'Fully Dilluted Valuation'
         data = {data.market_data.fully_dilluted_value}
         />
          <Bullet
         title = '24 hr Trading Vol.'
         data = {data.market_data.total_volume}
         />
           <Bullet
         title = 'Circulating Supply'
         data = {data.market_data.circulating_supply}
         />
         <Bullet
         title = 'Total Supply'
         data = {data.market_data.total_supply}
         />
         <Bullet
         title = 'Max Supply'
         data={data.market_data.max_supply ? data.market_data.max_supply : '∞'}
         />

        <div>
              <h2 className="font-semibold text-3xl mb-8">Info</h2>

              <div>
        <div className="flex justify-between">
        <span className="text-lg font-medium text-gray-400">Website</span>
        <div className="flex space-x-1">
        <a href={data.homeurl} className="text-lg font-medium text-white active-link-bg-color px-3 py-1 rounded-full">
            {data.name.toLowerCase()}
        </a>
        {data.whitepaper && data.whitepaper !== '' && (
        <a 
          href={data.whitepaper} 
          className="text-lg font-medium text-white active-link-bg-color px-3 py-1 rounded-full"
        >
          Whitepaper
        </a>
      )}
        </div>
        </div>
        <hr className="my-2 border-gray-800" />
        </div>

        <div>
        <div className="flex justify-between">
        <span className="text-lg font-medium text-gray-400">Community</span>
        <div className="flex space-x-1">
         {data.twitter && data.twitter !== '' && (
        <a href={`https://x.com/${data.twitter}`} className="text-md font-medium text-white active-link-bg-color px-3 py-1 rounded-full">
        <img src="/icons/twitter.svg" alt="Twitter" className="w-5 h-5 mr-1 inline" />
            Twitter
        </a>
        )}
        {data.facebook && data.facebook !== '' && ( 
        <a href={`https://facebook.com/${data.facebook}`} className="text-md font-medium text-white active-link-bg-color px-3 py-1 rounded-full">
        <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5 mr-1 inline" />
            Facebook
        </a>
        )}
        </div>
        </div>
        <hr className="my-2 border-gray-800" />
        </div>
        
        <div>
        <div className="flex justify-between">
        <span className="text-lg font-medium text-gray-400">Source Code</span>
        <div className="flex space-x-1">
        <a href={data.github} className="text-md font-medium text-white active-link-bg-color px-3 py-1 rounded-full">
        <img src="/icons/github.svg" alt="Github" className="w-5 h-5 mr-1 inline" />
           Github
        </a>
        </div>
        </div>
        <hr className="my-2 border-gray-800" />
        </div>

        <div>
        <div className="flex justify-between">
        <span className="text-lg font-medium text-gray-400">Categories</span>
        <div className="flex space-x-1">
        <span className="text-lg font-medium text-white active-link-bg-color px-3 py-1 rounded-full">
           {data.categories[0]}
        </span>
        </div>
        </div>
        <hr className="my-2 border-gray-800" />
        </div>
        </div>

        <div>
              <h2 className="font-semibold text-3xl mb-8">Historical Info</h2>

                    <div>
            <div className="flex justify-between">
            <span className="text-lg font-medium text-gray-400">24Hr Range</span>
            <span className="text-xl font-semibold text-white">
                ${data.market_data.high_24h?.toLocaleString()} - 
                ${data.market_data.low_24h?.toLocaleString()}
            </span>
            </div>
            <hr className="my-2 border-gray-800" />
        </div>


                  <div>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-400">All Time High</span>
              <div className="flex items-center space-x-2"> {/* Ensure value and change are on the same line */}
                <span className="text-xl font-semibold text-white">
                  ${data.market_data.ath?.toLocaleString()}
                </span>
                <Change data={data.market_data.ath_change} />
              </div>
            </div>
            <div className="flex justify-end mt-1"> {/* Align date to the right */}
              <span className="text-sm text-gray-400">
                {new Date(data.market_data.ath_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </span>
            </div>
            <hr className="my-2 border-gray-800" />
          </div>


                    <div>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-400">All Time Low</span>
              <div className="flex items-center space-x-2"> {/* Ensure value and change are on the same line */}
                <span className="text-xl font-semibold text-white">
                  ${data.market_data.atl?.toLocaleString()}
                </span>
                <Change data={data.market_data.atl_change} />
              </div>
            </div>
            <div className="flex justify-end mt-1"> {/* Align date to the right */}
              <span className="text-sm text-gray-400">
                {new Date(data.market_data.atl_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </span>
            </div>
            <hr className="my-2 border-gray-800" />
          </div>

                  <div>
          <h2 className="font-semibold text-3xl mb-4">Community Sentiment</h2>
          <p className="mb-2">
            {data.votes_up === null && data.votes_down === null
              ? 'There are no votes today'
              : `The community is ${data.votes_up > data.votes_down ? 'bullish' : 'bearish'} about ${data.name.toLowerCase()} today`}
          </p>

          <div className="flex space-x-4">
            <div className="flex items-center custom-bg-green custom-green p-2 rounded-full">
              <img src="/icons/bull.svg" alt="Bullish" className="w-6 h-6" />
              <span className="ml-2">
                {data.votes_up !== null ? data.votes_up.toFixed(0) : 0}%
              </span>
            </div>
            <div className="flex items-center custom-bg-red custom-red p-2 rounded-full">
              <img src="/icons/bear.svg" alt="Bearish" className="w-6 h-6" />
              <span className="ml-2">
                {data.votes_down !== null ? data.votes_down.toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>



        </div>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col space-y-4">
        <button
        onClick={handleBackClick}
        className="mb-4 text-white px-4 rounded-full min-w ml-auto"
      >
        Go Back<img className="ml-2 w-8 h-8 inline" src="/icons/back.svg" alt="Back" />
      </button>
          <CryptoChart cryptoId={coin} />
          <div className="custom-bg p-4 rounded-lg text-sm">
            <p>{data.description}</p>
          </div>
        </div>
        </div> 
        
      );
  };

export default CryptoData;
