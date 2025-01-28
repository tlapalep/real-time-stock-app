import React from "react";
import "./App.css";
import StockChart from "./components/StockChart";
import TradingPanel from "./components/TradingPanel";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Stock App</h1>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            width: "100%",
            maxWidth: "1200px",
            justifyContent: "space-between",
            padding: "0 1rem", 
          }}
        >
          <div style={{ flex: 1 }}>
            <StockChart />
          </div>
          <div style={{ width: "300px" }}> {/* Fixed width for TradingPanel */}
            <TradingPanel />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
