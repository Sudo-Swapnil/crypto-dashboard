import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { CandlestickElement, CandlestickController, OhlcController,OhlcElement } from 'chartjs-chart-financial'; // Ensure to import necessary elements
import { registerables } from 'chart.js';
import { Chart,Line } from 'react-chartjs-2'; // Import the basic Chart component from chart.js
import 'chartjs-adapter-date-fns'; 
// Register all chart elements including the candlestick chart
ChartJS.register(
  ...registerables, // Register all default components of Chart.js
  CandlestickElement, // Register the CandlestickElement for candlestick charts
  CandlestickController,OhlcController,OhlcElement // Register the FinancialChartController for candlestick charts
);

const CryptoChart = ({ cryptoId }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('price'); // 'price' or 'market_cap'
    const [duration, setDuration] = useState('7'); // '1', '7', '30', '90', '365'
    const [chartType, setChartType] = useState('area'); // 'area' or 'candlestick'
    const chartRef = useRef(null); // Ref to the chart
  
    // Fetch data from the API
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
          let data = null;
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          };
          if (selectedMetric === 'price') {
            // Fetch OHLC data for price
            const ohlcResponse = await fetch(`http://localhost:8080/api/coingecko/${cryptoId}/ohlc?days=${duration}`,
              { method: 'GET', headers }
            );
            if (!ohlcResponse.ok) {
              throw new Error(`HTTP error! status: ${ohlcResponse.status}`);
            }
            data = await ohlcResponse.json();
          } else {
            // Fetch market chart data for market cap
            const marketChartResponse = await fetch(`http://localhost:8080/api/coingecko/${cryptoId}/market_chart?days=${duration}`,
              { method: 'GET', headers }
            );
            if (!marketChartResponse.ok) {
              throw new Error(`HTTP error! status: ${marketChartResponse.status}`);
            }
            data = await marketChartResponse.json();
          }
  
          const labels = data.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
  
          // Handle price data vs market cap data
          if (selectedMetric === 'price') {
            if (chartType === 'area') {
              const priceData = data.map(([_, price]) => price);
              const minValue = Math.min(...priceData);
              const maxValue = Math.max(...priceData);
              const cushion = (maxValue - minValue) * 0.05; // 5% cushion for Y-axis
              setChartData({
                labels,
                datasets: [
                  {
                    label: 'Price (USD)',
                    data: priceData,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                  },
                ],
                yMin: Math.floor(minValue - cushion),
                yMax: Math.ceil(maxValue + cushion),
              });
            } else if (chartType === 'candlestick') {
              const ohlcData = data.map(([timestamp, open, high, low, close]) => ({
                x: timestamp,
                o: open,
                h: high,
                l: low,
                c: close,
              }));
              setChartData({
                labels,
                datasets: [
                  {
                    label: 'Price (USD)',
                    data: ohlcData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    tension: 0.4,
                    pointRadius: 0,
                    type: 'candlestick', // Correct type for candlestick charts
                  },
                ],
              });
            }
          } else if (selectedMetric === 'market_cap') {
            const marketCapData = data.market_caps.map(([_, marketCap]) => marketCap);
            const minValue = Math.min(...marketCapData);
            const maxValue = Math.max(...marketCapData);
            const cushion = (maxValue - minValue) * 0.05;
            setChartData({
              labels,
              datasets: [
                {
                  label: 'Market Cap (USD)',
                  data: marketCapData,
                  fill: true,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                },
              ],
              yMin: Math.floor(minValue - cushion),
              yMax: Math.ceil(maxValue + cushion),
            });
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchChartData();
    }, [cryptoId, selectedMetric, duration, chartType]);
  
    // Ensure the chart is destroyed before re-rendering
    useEffect(() => {
      if (chartRef.current) {
        chartRef.current.chartInstance?.destroy(); // Destroy the previous chart instance if it exists
      }
    }, [chartData]);
  
    return (
        <div>
          {/* All buttons on one line */}
          <div className='justify-between flex mb-4'>
            {/* Metric Selector */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`px-4 py-2 rounded-lg custom-bg ${selectedMetric === 'price' ? 'active-link-color' : 'text-white'}`}
                onClick={() => setSelectedMetric('price')}
              >
                Price
              </button>
              <button
                className={`px-4 py-2 rounded-lg custom-bg ${selectedMetric === 'market_cap' ? 'active-link-color' : 'text-white'}`}
                onClick={() => setSelectedMetric('market_cap')}
              >
                Market Cap
              </button>
            </div>
      
            {/* Chart Type Selector (only for price metric) */}
            {selectedMetric === 'price' && (
  <div style={{ display: 'flex', gap: '10px' }}>
    <button
      className={`px-4 py-2 rounded-lg custom-bg`}
      onClick={() => setChartType('area')}
    >
      <img
        src={chartType === 'area' ? '/active_icons/area_active.svg' : '/icons/area.svg'}
        alt="Area Chart"
        width={20} // You can adjust the width as needed
        height={20} // You can adjust the height as needed
      />
    </button>
    <button
      className={`px-4 py-2 rounded-lg custom-bg`}
      onClick={() => setChartType('candlestick')}
    >
      <img
        src={chartType === 'candlestick' ? '/active_icons/candlestick_active.svg' : '/icons/candlestick.svg'}
        alt="Candlestick Chart"
        width={20} // Adjust as needed
        height={20} // Adjust as needed
      />
    </button>
  </div>
)}
      
            {/* Duration Selector */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['1', '7', '30', '90', '365'].map((d) => (
                <button
                  key={d}
                  className={`px-4 py-2 rounded-lg custom-bg ${duration === d ? 'active-link-color' : 'text-white'}`}
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
            chartType === 'area' ? (
              <Line
                ref={chartRef}
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
                      ticks: {
                        stepSize: Math.ceil(chartData.labels.length / 6),
                        maxTicksLimit: 6,
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: selectedMetric === 'price' ? 'Price (USD)' : 'Market Cap (USD)',
                      },
                      min: chartData.yMin,
                      max: chartData.yMax,
                    },
                  },
                }}
              />
            ) : (
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
                    y: {
                      title: {
                        display: true,
                        text: 'Price (USD)',
                      },
                      beginAtZero: false, // Don't start the Y-axis at zero for candlestick
                    },
                  },
                }}
              />
            )
          ) : (
            <p>No data available</p>
          )}
        </div>
      );
      
};

export default CryptoChart;
