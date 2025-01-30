import React, { useState, useEffect } from "react";

function TradingPanel() {
  const [balance, setBalance] = useState(10000); // User's balance in USD
  const [shares, setShares] = useState(0); // Number of shares owned
  const [currentPrice, setCurrentPrice] = useState(150); // Current stock price
  const [tradeAmount, setTradeAmount] = useState(1); // Amount to buy/sell
  const [message, setMessage] = useState(""); // Success/error messages

  // Fetch initial data (current price)
  useEffect(() => {
    fetch("/api/stock/info")
      .then((res) => res.json())
      .then((data) => {
        setCurrentPrice(data.price);
      })
      .catch((error) => console.error("Error fetching stock info:", error));
  }, []);

  // Optimistic Buy
  const handleBuy = () => {
    const totalCost = currentPrice * tradeAmount;

    if (balance < totalCost) {
      setMessage("Insufficient funds to buy.");
      return;
    }

    // Optimistic UI update
    setBalance((prev) => prev - totalCost);
    setShares((prev) => prev + tradeAmount);
    setMessage(`You bought ${tradeAmount} shares.`);

    fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "buy", amount: tradeAmount }),
    })
      .then((res) => {
        if (!res.ok) {
          // Revert changes on server error
          return res.json().then((err) => {
            setBalance((prev) => prev + totalCost);
            setShares((prev) => prev - tradeAmount);
            setMessage(err.message || "Error occurred while buying.");
          });
        } else {
          return res.json().then((data) => {
            setBalance(data.balance);
            setShares(data.shares);
          });
        }
      })
      .catch((error) => {
        // Handle network error
        setBalance((prev) => prev + totalCost);
        setShares((prev) => prev - tradeAmount);
        setMessage("Network error while buying.");
        console.error(error);
      });
  };

  // Optimistic Sell
  const handleSell = () => {
    if (shares < tradeAmount) {
      setMessage("You do not have enough shares to sell.");
      return;
    }

    const totalRevenue = currentPrice * tradeAmount;

    // Optimistic UI update
    setBalance((prev) => prev + totalRevenue);
    setShares((prev) => prev - tradeAmount);
    setMessage(`You sold ${tradeAmount} shares.`);

    fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sell", amount: tradeAmount }),
    })
      .then((res) => {
        if (!res.ok) {
          // Revert changes on server error
          return res.json().then((err) => {
            setBalance((prev) => prev - totalRevenue);
            setShares((prev) => prev + tradeAmount);
            setMessage(err.message || "Error occurred while selling.");
          });
        } else {
          return res.json().then((data) => {
            setBalance(data.balance);
            setShares(data.shares);
          });
        }
      })
      .catch((error) => {
        // Handle network error
        setBalance((prev) => prev - totalRevenue);
        setShares((prev) => prev + tradeAmount);
        setMessage("Network error while selling.");
        console.error(error);
      });
  };

  return (
    <div style={styles.panel}>
      <h2>Trading Panel</h2>
      <p>Balance: ${balance.toFixed(2)}</p>
      <p>Shares Held: {shares}</p>
      <p>Current Price: ${currentPrice.toFixed(2)}</p>

      <div>
        <label>Amount: </label>
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
    fontFamily: "Arial, sans-serif",
  },
  buttons: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
};

export default TradingPanel;
