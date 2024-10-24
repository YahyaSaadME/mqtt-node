// broker.js
const aedes = require('aedes')();
const net = require('net');
const ws = require('ws'); // For WebSocket support

// TCP server for MQTT
const port = 1883;
const server = net.createServer(aedes.handle);

// WebSocket server (Optional for WebSocket connections)
const wsPort = 8888;
const httpServer = require('http').createServer();
const wsServer = new ws.Server({ server: httpServer });

wsServer.on('connection', function (conn) {
  const stream = aedes.handle(conn);
  conn.on('close', () => stream.end());
});

// MQTT server started on TCP
server.listen(port, function () {
  console.log(`MQTT broker started and listening on port ${port}`);
});

// WebSocket server started
httpServer.listen(wsPort, function () {
  console.log(`MQTT broker over WebSocket is listening on port ${wsPort}`);
});

// Event listeners for Aedes broker
aedes.on('client', (client) => {
  console.log(`Client Connected: ${client.id}`);
});

aedes.on('clientDisconnect', (client) => {
  console.log(`Client Disconnected: ${client.id}`);
});

aedes.on('publish', (packet, client) => {
  if (client) {
    console.log(`Message from client ${client.id}: ${packet.payload.toString()}`);
  }
});

aedes.on('subscribe', (subscriptions, client) => {
  console.log(`Client ${client.id} subscribed to topics: ${subscriptions.map(s => s.topic).join(', ')}`);
});

aedes.on('unsubscribe', (subscriptions, client) => {
  console.log(`Client ${client.id} unsubscribed from topics: ${subscriptions.join(', ')}`);
});
