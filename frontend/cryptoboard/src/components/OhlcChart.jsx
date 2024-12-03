import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { CandlestickElement, CandlestickController } from 'chartjs-chart-financial';
import { registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register chart elements
ChartJS.register(
  ...registerables,
  CandlestickElement,
  CandlestickController
);

const OhlcChart = ({ cryptoList }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoList[0]); // Initialize with the first crypto
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState('7'); // Default to 7 days
  const chartRef = useRef(null);
  console.log("Debugging",selectedCrypto)
  // Fetch OHLC data
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const response = await fetch(
          `http://localhost:8080/api/coingecko/${selectedCrypto.cryptoId}/ohlc?days=${duration}`,
          { method: 'GET', headers }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const ohlcData = data.map(([timestamp, open, high, low, close]) => ({
          x: timestamp,
          o: open,
          h: high,
          l: low,
          c: close,
        }));

        setChartData({
          datasets: [
            {
              label: 'Price (USD)',
              data: ohlcData,
              type: 'candlestick',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedCrypto, duration]);

  return (
    <div>
        <div className='flex justify-between'>
      {/* Header with icon, symbol, and dropdown */}
      <div className="flex items-center mb-4">
        <img src={selectedCrypto.icon} alt={`${selectedCrypto.symbol} icon`} className="w-8 h-8 mr-2" />
        <span className="text-lg font-bold mr-2">{selectedCrypto.name}</span>
        <select
          className="px-2 py-1 rounded custom-bg"
          value={selectedCrypto.cryptoId}
          onChange={(e) =>
            setSelectedCrypto(cryptoList.find((crypto) => crypto.cryptoId === e.target.value))
          }
        >
          {cryptoList.map((crypto) => (
            <option key={crypto.cryptoId} value={crypto.cryptoId}>
              {crypto.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Selector */}
      <div className="flex gap-2 mb-4">
        {['1', '7', '30', '90', '365'].map((d) => (
          <button
            key={d}
            className={`px-4 py-2 rounded-lg custom-bg ${
              duration === d ? 'active-link-color' : 'text-white'
            }`}
            onClick={() => setDuration(d)}
          >
            {d === '1' ? '24h' : d === '7' ? '7d' : d === '30' ? '1m' : d === '90' ? '3m' : '1y'}
          </button>
        ))}
      </div>
      </div>

      {/* Chart */}
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <Chart
          ref={chartRef}
          type="candlestick"
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Price (USD)',
                },
                beginAtZero: false,
              },
            },
          }}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default OhlcChart;
