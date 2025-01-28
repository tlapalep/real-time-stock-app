import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const StockChart = () => {
  const chartContainerRef = useRef(null);

  
  const [chart, setChart] = useState(null);
  const [lineSeries, setLineSeries] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(150);

  
  useEffect(() => {
    fetch("/api/stock/history")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA RECIBIDA DEL BACKEND:", data);
        const formattedData = data.map((point) => ({
          
          time: point.time,
          value: parseFloat(point.price),
        }));
        setHistoricalData(formattedData);
      })
      .catch((err) => console.error("Error fetching history:", err));

   
    fetch("/api/stock/info")
      .then((res) => res.json())
      .then((info) => setCurrentPrice(info.price))
      .catch((err) => console.error("Error fetching info:", err));
  }, []);


  useEffect(() => {
    
    if (!chartContainerRef.current || historicalData.length === 0 || chart) return;

    const createdChart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: "#FFFFFF",
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      timeScale: { borderColor: "#ccc" },
      crosshair: { mode: 1 },
    });

    const createdLineSeries = createdChart.addLineSeries({
      lineColor: "#2196F3",
      lineWidth: 2,
    });

   
    createdLineSeries.setData(historicalData);

  
    setChart(createdChart);
    setLineSeries(createdLineSeries);
  }, [historicalData, chart]);

 
  useEffect(() => {
    if (!lineSeries) return;

    const socket = new WebSocket("ws://localhost:5002");

    socket.onopen = () => {
      console.log("WebSocket conectado");
    };

    socket.onmessage = (event) => {
      try {
        
        const newPoint = JSON.parse(event.data);
        lineSeries.update(newPoint);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket desconectado");
    };

    return () => {
      socket.close();
    };
  }, [lineSeries]);

  useEffect(() => {
    return () => {
      if (chart) {
        chart.remove();
      }
    };
  }, []); 

  return (
    <div style={{ width: "100%" }}>
      <h2>Stock Chart</h2>
      <p>Current Price: ${currentPrice}</p>
      <div
        ref={chartContainerRef}
        style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default StockChart;