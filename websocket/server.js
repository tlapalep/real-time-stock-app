const WebSocket = require('ws');

// Crear el servidor WebSocket en el puerto 5001
const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Enviar un precio simulado cada segundo
  const interval = setInterval(() => {
    const price = (150 + Math.random() * 10).toFixed(2); // Generar precio aleatorio
    ws.send(JSON.stringify({ price })); // Enviar datos en formato JSON
  }, 1000);

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval); // Detener el envío de precios
  });
});

console.log('WebSocket server running on port 5001');
