import React, { useState, useEffect } from "react";

function TradingPanel() {
  // Estados locales para saldo, acciones y precio actual
  const [balance, setBalance] = useState(10000);
  const [shares, setShares] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(150);

  // Estado para la cantidad a comprar/vender
  const [tradeAmount, setTradeAmount] = useState(1);

  // Estado para manejar mensajes de error o confirmación
  const [message, setMessage] = useState("");

  // Efecto para obtener datos iniciales (precio actual, saldo, acciones) desde el backend
  useEffect(() => {
    fetch("/api/stock/info")
      .then((res) => res.json())
      .then((data) => {
        // data = { symbol: 'AAPL', price: 150 }
        setCurrentPrice(data.price);
      })
      .catch((error) => console.error(error));
    // Podrías también llamar a otro endpoint para obtener balance y shares iniciales
  }, []);

  // Actualización optimista de compra
  const handleBuy = () => {
    const totalCost = currentPrice * tradeAmount;

    // Verificamos si hay fondos suficientes localmente
    if (balance < totalCost) {
      setMessage("Fondos insuficientes para comprar.");
      return;
    }

    // 1. Actualiza UI de manera optimista
    setBalance((prev) => prev - totalCost);
    setShares((prev) => prev + tradeAmount);
    setMessage(`Compraste ${tradeAmount} acciones.`);

    // 2. Envía la petición al backend
    fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "buy", amount: tradeAmount }),
    })
      .then((res) => {
        if (!res.ok) {
          // Si hay un error en el servidor, revertimos cambios
          return res.json().then((err) => {
            setBalance((prev) => prev + totalCost);
            setShares((prev) => prev - tradeAmount);
            setMessage(err.message || "Ocurrió un error al comprar.");
          });
        } else {
          return res.json().then((data) => {
            // data = { success: true, balance, shares }
            setBalance(data.balance);
            setShares(data.shares);
          });
        }
      })
      .catch((error) => {
        // Manejo de error de red
        setBalance((prev) => prev + totalCost);
        setShares((prev) => prev - tradeAmount);
        setMessage("Error de red al comprar.");
        console.error(error);
      });
  };

  // Actualización optimista de venta
  const handleSell = () => {
    // Verificar si el usuario tiene suficientes acciones
    if (shares < tradeAmount) {
      setMessage("No tienes suficientes acciones para vender.");
      return;
    }

    // 1. Actualiza UI de manera optimista
    const totalRevenue = currentPrice * tradeAmount;
    setBalance((prev) => prev + totalRevenue);
    setShares((prev) => prev - tradeAmount);
    setMessage(`Vendiste ${tradeAmount} acciones.`);

    // 2. Envía la petición al backend
    fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sell", amount: tradeAmount }),
    })
      .then((res) => {
        if (!res.ok) {
          // Si hay un error en el servidor, revertimos cambios
          return res.json().then((err) => {
            setBalance((prev) => prev - totalRevenue);
            setShares((prev) => prev + tradeAmount);
            setMessage(err.message || "Ocurrió un error al vender.");
          });
        } else {
          return res.json().then((data) => {
            // data = { success: true, balance, shares }
            setBalance(data.balance);
            setShares(data.shares);
          });
        }
      })
      .catch((error) => {
        // Manejo de error de red
        setBalance((prev) => prev - totalRevenue);
        setShares((prev) => prev + tradeAmount);
        setMessage("Error de red al vender.");
        console.error(error);
      });
  };

  return (
    <div style={styles.panel}>
      <h2>Trading Panel</h2>
      <p>Balance: ${balance}</p>
      <p>Shares Held: {shares}</p>
      <p>Current Price: ${currentPrice}</p>

      <div>
        <label>Cantidad: </label>
        <input
          type="number"
          min="1"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(Number(e.target.value))}
        />
      </div>

      <div style={styles.buttons}>
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

const styles = {
  panel: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "300px",
    margin: "16px auto",
  },
  buttons: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
};

export default TradingPanel;
