import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import OhlcChart from '../components/OhlcChart';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [coinData, setCoinData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleHoldingsCount = 2;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/portfolio/value', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch portfolio');
        }

        const portfolioData = await response.json();
        setPortfolio(portfolioData);

        // Fetch coin data for all holdings
        const coinDataPromises = portfolioData.holdings.map(async (holding) => {
          const coinResponse = await fetch(`http://localhost:8080/api/coingecko/${holding.coinId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          });

          if (!coinResponse.ok) {
            throw new Error(`Failed to fetch data for ${holding.coinId}`);
          }

          const coinDetails = await coinResponse.json();
          return { coinId: holding.coinId, details: coinDetails };
        });

        // Wait for all coin data to be fetched
        const fetchedCoinData = await Promise.all(coinDataPromises);

        // Update state with fetched coin data
        const updatedCoinData = fetchedCoinData.reduce((acc, { coinId, details }) => {
          acc[coinId] = details;
          return acc;
        }, {});

        setCoinData(updatedCoinData);
        setIsLoading(false); // Mark loading as complete
      } catch (err) {
        setError('Failed to fetch portfolio data or coin details');
        setIsLoading(false); // Even in case of error, stop loading
      }
    };

    fetchPortfolio();
  }, []);

  const getSparklineData = (prices) => ({
    labels: prices.map((_, idx) => idx),
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const { totalValue, totalPurchasedValue } = portfolio;
  const change = totalValue - totalPurchasedValue;
  const changePercent = ((change / totalPurchasedValue) * 100).toFixed(2);

  const cryptoList = Object.entries(coinData).map(([cryptoId, details]) => ({
    cryptoId,
    name: details.name,
    icon: details.icon,
    symbol: details.symbol.toUpperCase(),
  }));

  const handleNext = () => {
    if (currentIndex + visibleHoldingsCount < portfolio.holdings.length) {
      setCurrentIndex(currentIndex + visibleHoldingsCount);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - visibleHoldingsCount);
    }
  };

  const visibleHoldings = portfolio.holdings.slice(
    currentIndex,
    currentIndex + visibleHoldingsCount
  );

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col h-screen">
      <div className="w-2/3 custom-bg p-6 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg">My Balance</h1>
            <h2 className="text-2xl font-bold mt-2">${totalValue.toFixed(2)}</h2>
            <p
              className={`text-lg font-medium mt-2 ${
                change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              ${change.toFixed(2)} ({changePercent}%)
            </p>
          </div>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800">
              <img className="w-4 h-4 inline mr-2" src="/icons/dollar.svg" alt="deposit icon" />
              Deposit
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800">
              <img className="w-4 h-4 inline mr-2" src="/icons/wallet.svg" alt="withdraw icon" />
              Withdraw
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="flex space-x-4 overflow-x-scroll no-scrollbar">
            {visibleHoldings.map((holding) => {
              const coinDetails = coinData[holding.coinId];
              return (
                <div
                  key={holding.coinId}
                  className="flex space-x-4 w-1/2 p-4 bg-black rounded-lg"
                >
                  <div className="flex flex-col">
                    <div className="flex space-x-4">
                      <img
                        src={coinDetails.icon}
                        alt={coinDetails.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h3 className="text-2xl font-semibold text-white">
                          {coinDetails.symbol.toUpperCase()}
                        </h3>
                        <p className="text-lg text-gray-400">{coinDetails.name}</p>
                      </div>
                    </div>
                    <p className="flex items-center text-xl text-white font-semibold mt-4">
                      ${coinDetails.market_data.current_price}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-32" style={{ maxWidth: '150px' }}>
                      <Line
                        data={getSparklineData(coinDetails.sparkline)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            tooltip: { enabled: false },
                            legend: { display: false },
                          },
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          elements: {
                            line: { tension: 0.2 },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 text-white rounded-full disabled:opacity-0"
            >
              ⬅️
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={handleNext}
              disabled={currentIndex + visibleHoldingsCount >= portfolio.holdings.length}
              className="p-2 text-white rounded-full disabled:opacity-0"
            >
              ➡️
            </button>
          </div>
        </div>
      </div>
      <div className="w-2/3 mt-6 p-6">
        <OhlcChart cryptoList={cryptoList} />
      </div>
    </div>
  );
};

export default PortfolioPage;

