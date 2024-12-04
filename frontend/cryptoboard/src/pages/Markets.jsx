import React from 'react';
import SearchBar from '../components/SearchBar';
import Card from '../components/Cards';


const cryptoData = [
  {
    id: 'ethereum', 
    imageSrc: '/cryptos/ETH.svg', // Replace with the correct path to your image
    subtitle: 'ETH',
    title: 'Ethereum',
  },
  {
    id: 'bitcoin',  
    imageSrc: '/cryptos/bitcoin.svg', // Replace with the correct path to your image
    subtitle: 'BTC',
    title: 'Bitcoin',
  },
  {
    id: 'viberate', 
    imageSrc: '/cryptos/vibrate.svg', // Replace with the correct path to your image
    subtitle: 'VIB',
    title: 'Viberate',
  },
  {
    id: 'binance-coin-wormhole', 
    imageSrc: '/cryptos/binance.svg', // Replace with the correct path to your image
    subtitle: 'BNB',
    title: 'Binance Coin',
  },
  {
    id: 'nuls', 
    imageSrc: '/cryptos/nuls.svg', // Replace with the correct path to your image
    subtitle: 'NULS',
    title: 'NULS',
  },
  {
    id: 'telcoin', 
    imageSrc: '/cryptos/tels.svg', // Replace with the correct path to your image
    subtitle: 'TEL',
    title: 'Telcoin',
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
            id = {crypto.id}
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
