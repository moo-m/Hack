const WebSocket = require('ws');

// Render يعين المنفذ عبر متغير البيئة PORT
const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

server.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`🔌 Client connected: ${ip}`);

  ws.on('message', (message, isBinary) => {
    const data = isBinary ? message : message.toString();
    console.log(`📩 Received: ${data}`);

    // إعادة بث الرسالة لجميع العملاء المتصلين
    server.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${ip}`);
  });
});
