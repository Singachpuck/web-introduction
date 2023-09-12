const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const messages = [];

app.use('/static', express.static(join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'templates/index.html'));
});

app.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(messages);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('msg', (msg) => {
    console.log('Received message: ' + msg.msg);
    io.emit('msg', msg);
    messages.push(msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});