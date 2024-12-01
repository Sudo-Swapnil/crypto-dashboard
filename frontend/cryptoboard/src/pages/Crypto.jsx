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
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8080/api/coingecko/${coin}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
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
          <div className="flex items-center space-x-4" style={{ marginBottom: '40px' }}>
            {/* Current Price */}
            <span className="font-semibold text-4xl text-white-700">
              ${data.market_data.current_price?.toLocaleString()}
            </span>
            {/* Change Percentage */}
            <Change
            data = {data.market_data.price_change_24h}
            />
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
