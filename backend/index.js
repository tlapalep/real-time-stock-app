// Importa Express
const express = require('express');
const app = express();
const PORT = 5001;

// Datos de muestra sobre el stock
const stockInfo = { symbol: 'AAPL', price: 150 };

// Datos en memoria para la demostración
let userBalance = 10000; // Saldo en USD
let userShares = 0;      // Cantidad de acciones que tiene el usuario

// API para obtener la información del stock
app.get('/api/stock/info', (req, res) => {
  res.json(stockInfo);
});

// API para obtener datos históricos del stock (datos simulados con fluctuaciones aleatorias)
app.get('/api/stock/history', (req, res) => {
  const history = [];
  let price = stockInfo.price;
  
  // Genera 50 datos históricos con fluctuaciones aleatorias
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.5) * 5; // Fluctuación aleatoria
    history.push({ time: Date.now() + i * 1000, price: price.toFixed(2) });
  }

  // Devuelve los datos históricos
  res.json(history);
});

// Manejo de solicitudes de compra/venta de acciones
app.post('/api/trades', express.json(), (req, res) => {
  const { action, amount } = req.body;

  // Verificar la acción de compra
  if (action === 'buy') {
    const totalCost = amount * stockInfo.price; // Cálculo del costo total
    if (userBalance >= totalCost) { // Si el saldo es suficiente
      userBalance -= totalCost;      // Restar el costo del saldo
      userShares += amount;          // Aumentar la cantidad de acciones
      res.json({ success: true, balance: userBalance, shares: userShares });
    } else {
      res.status(400).json({ success: false, message: 'Fondos insuficientes' });
    }
  } 
  // Verificar la acción de venta
  else if (action === 'sell') {
    if (userShares >= amount) { // Si el usuario tiene suficientes acciones
      const totalRevenue = amount * stockInfo.price; // Cálculo de los ingresos
      userBalance += totalRevenue;   // Sumar los ingresos al saldo
      userShares -= amount;          // Restar la cantidad de acciones vendidas
      res.json({ success: true, balance: userBalance, shares: userShares });
    } else {
      res.status(400).json({ success: false, message: 'Acciones insuficientes' });
    }
  } 
  // Acción no válida
  else {
    res.status(400).json({ success: false, message: 'Acción inválida' });
  }
});

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => console.log(`API corriendo en el puerto ${PORT}`));
