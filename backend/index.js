
const express = require('express');
const app = express();
const PORT = 5001;


const stockInfo = { symbol: 'AAPL', price: 150 };


let userBalance = 10000; 
let userShares = 0;      


app.get('/api/stock/info', (req, res) => {
  res.json(stockInfo);
});
app.get('/api/stock/history', (req, res) => {
  const history = [];
  let price = stockInfo.price;


  const baseDate = new Date();

  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.5) * 5;

   
    const dateObj = new Date(baseDate);
    dateObj.setDate(baseDate.getDate() + i);

 
    const isoDate = dateObj.toISOString().slice(0, 10);

    history.push({
      time: isoDate,
      price: price.toFixed(2),
    });
  }

  res.json(history);
});





app.post('/api/trades', express.json(), (req, res) => {
  const { action, amount } = req.body;

 
  if (action === 'buy') {
    const totalCost = amount * stockInfo.price;
    if (userBalance >= totalCost) { 
      userBalance -= totalCost;    
      userShares += amount;         
      res.json({ success: true, balance: userBalance, shares: userShares });
    } else {
      res.status(400).json({ success: false, message: 'Fondos insuficientes' });
    }
  } 
  else if (action === 'sell') {
    if (userShares >= amount) {
      const totalRevenue = amount * stockInfo.price; 
      userBalance += totalRevenue;  
      userShares -= amount;  
      res.json({ success: true, balance: userBalance, shares: userShares });
    } else {
      res.status(400).json({ success: false, message: 'Acciones insuficientes' });
    }
  } 
  else {
    res.status(400).json({ success: false, message: 'Acción inválida' });
  }
});


app.listen(PORT, '0.0.0.0', () => console.log(`API corriendo en el puerto ${PORT}`));
