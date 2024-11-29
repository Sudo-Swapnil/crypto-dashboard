import React from 'react';
import SearchBar from '../components/SearchBar';
import Card from '../components/Cards';


const cryptoData = [
  {
    imageSrc: '/cryptos/ETH.svg', // Replace with the correct path to your image
    subtitle: 'ETH',
    title: 'Ethereum',
  },
  {
    imageSrc: '/cryptos/bitcoin.svg', // Replace with the correct path to your image
    subtitle: 'BTC',
    title: 'Bitcoin',
  },
  {
    imageSrc: '/cryptos/vibrate.svg', // Replace with the correct path to your image
    subtitle: 'LTC',
    title: 'Litecoin',
  },
  {
    imageSrc: '/cryptos/binance.svg', // Replace with the correct path to your image
    subtitle: 'XRP',
    title: 'Ripple',
  },
  {
    imageSrc: '/cryptos/nuls.svg', // Replace with the correct path to your image
    subtitle: 'DOGE',
    title: 'Dogecoin',
  },
  {
    imageSrc: '/cryptos/tels.svg', // Replace with the correct path to your image
    subtitle: 'ADA',
    title: 'Cardano',
  },
];


const Markets = () => {
  return (
    <div>
      <SearchBar/>
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {cryptoData.map((crypto, index) => (
          <Card
            key={index}
            imageSrc={crypto.imageSrc}
            subtitle={crypto.subtitle}
            title={crypto.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Markets;
