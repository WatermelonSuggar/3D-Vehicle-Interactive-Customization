const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('message', (message) => {
    let data = JSON.parse(message);
    
    if (data.type === 'sensor') {
      console.log('Datos de sensor:', data.values);
      // Procesar datos de sensores
    } else if (data.type === 'image') {
      console.log('Imagen recibida');
      // Enviar la imagen a cables.gl
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.data); // Enviar la imagen a cables.gl
        }
      });
    } else {
      console.log("Error")
    }
  });
});
