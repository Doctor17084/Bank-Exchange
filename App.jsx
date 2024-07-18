import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [banksData, setBanksData] = useState([]);
  const [currencyIndices, setCurrencyIndices] = useState({ LB: 0, TB: 0, BG: 0 });

  useEffect(() => {
    fetchBanksData();
  }, []);

  const fetchBanksData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/banks');
      setBanksData(response.data);
    } catch (error) {
      console.error('Error fetching banks data:', error);
    }
  };

  const handleButtonClick = (bankCode) => {
    setCurrencyIndices({
      ...currencyIndices,
      [bankCode]: (currencyIndices[bankCode] + 1) % 3,
    });
  };

  const getCurrencyLabel = (index) => {
    switch (index) {
      case 0:
        return 'USD';
      case 1:
        return 'EUR';
      case 2:
        return 'GEL';
      default:
        return '';
    }
  };

  return (
    <div className="App">
      <h1>Bank Currency Exchange Rates</h1>
      {banksData.map((bank) => (
        <div key={bank.code} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ marginRight: '20px' }}>{bank.name}</h2>
          <button onClick={() => handleButtonClick(bank.code)} style={{ marginRight: '10px' }}>
            {getCurrencyLabel(currencyIndices[bank.code])}
          </button>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {bank.operatingCurrencies.map((currency) => {
              if (
                (currencyIndices[bank.code] === 0 && currency.currency !== 'USD') ||
                (currencyIndices[bank.code] === 1 && currency.currency !== 'EUR') ||
                (currencyIndices[bank.code] === 2 && currency.currency !== 'GEL')
              ) {
                return null;
              }
              return (
                <li key={currency.currency} style={{ display: 'inline', marginRight: '20px' }}>
                  {currency.currency}: Buy Rate - {currency.buyRate}, Sell Rate - {currency.sellRate}, Date - {currency.date}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
