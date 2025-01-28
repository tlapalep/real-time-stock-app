const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
  console.log('Client connected');

 
  const interval = setInterval(() => {
    const price = (150 + Math.random() * 10).toFixed(2); 
    ws.send(JSON.stringify({ price })); /
  }, 1000);

 
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval); 
  });
});

console.log('WebSocket server running on port 5001');
