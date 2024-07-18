const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enable CORS

// ბანკების სია
const banks = [
  { code: 'LB', name: 'ლიბერთი ბანკი' },
  { code: 'TB', name: 'თბს ბანკ' },
  { code: 'BG', name: 'საქართველოს ბანკი' },
];

// ვალუტების კურსები ბანკების მიხედვით
const currencyRates = {
  USD: [
    { bankCode: 'LB', rate: 2.75, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'LB', rate: 2.80, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 2.76, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 2.81, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 2.78, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 2.83, type: 'sell', date: '2024-07-18T10:00:00Z' }
  ],
  EUR: [
    { bankCode: 'LB', rate: 3.20, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'LB', rate: 3.25, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 3.22, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 3.27, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 3.24, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 3.29, type: 'sell', date: '2024-07-18T10:00:00Z' }
  ],
  GEL: [
    { bankCode: 'LB', rate: 3.20, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'LB', rate: 3.25, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 3.22, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'TB', rate: 3.27, type: 'sell', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 3.24, type: 'buy', date: '2024-07-18T10:00:00Z' },
    { bankCode: 'BG', rate: 3.29, type: 'sell', date: '2024-07-18T10:00:00Z' }
  ],
};

// მეთოდი 1: ბანკების სია
app.get('/banks', (req, res) => {
  const bankData = banks.map(bank => {
    const operatingCurrencies = Object.keys(currencyRates).filter(currency =>
      currencyRates[currency].some(rate => rate.bankCode === bank.code)
    );

    return {
      code: bank.code,
      name: bank.name,
      operatingCurrencies: operatingCurrencies.map(currency => {
        const buyRate = currencyRates[currency].find(rate => rate.bankCode === bank.code && rate.type === 'buy');
        const sellRate = currencyRates[currency].find(rate => rate.bankCode === bank.code && rate.type === 'sell');

        return {
          currency: currency,
          buyRate: buyRate ? buyRate.rate : 'N/A',
          sellRate: sellRate ? sellRate.rate : 'N/A',
          date: sellRate ? sellRate.date : 'N/A'
        };
      })
    };
  });

  res.json(bankData);
});

// მეთოდი 2: ვალუტების სია ბანკის მიხედვით
app.get('/currency/:currency', (req, res) => {
  const { currency } = req.params;
  const { bankCode } = req.query;

  if (!currency || !currencyRates[currency]) {
    return res.status(400).json({ error: 'Invalid currency specified' });
  }

  let rates = currencyRates[currency];
  if (bankCode) {
    rates = rates.filter(rate => rate.bankCode === bankCode);
  }

  const buyRates = rates.filter(rate => rate.type === 'buy');
  const sellRates = rates.filter(rate => rate.type === 'sell');

  const response = {
    currency,
    buyCount: buyRates.length,
    sellCount: sellRates.length,
    buyRates: buyRates.map(rate => ({ bankCode: rate.bankCode, rate: rate.rate, date: rate.date })),
    sellRates: sellRates.map(rate => ({ bankCode: rate.bankCode, rate: rate.rate, date: rate.date }))
  };

  res.json(response);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
