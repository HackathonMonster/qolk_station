'use strict';

const net = require('net');
const request = require('request');

const clients = [];

const port = 3001;

const sendServer = (data) => {
  const options = {
    url: 'http://qolk.cloudapp.net/',
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    form: data
  };
  request(options, () => {
  });
};

const convert = (data) => {
  return {
    'temperature': parseInt(data.slice(0, 4), 16) / 65536.0 * 165.0 - 40.0,
    'humidity': parseInt(data.slice(4, 8), 16) / 65536.0 * 100.0,
    'alcohol': parseInt(data.slice(8, 12), 16)
  };
};

net.createServer((socket) => {
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.push(socket);

  socket.on('data', (data) => {
    clients[clients.indexOf(socket)].write(data);
    process.stdout.write(`Station: get data@${new Date()} - ${data}\n`);
    const qolk = `${data}`.split('\n')[2];
    const jsonData = convert(qolk);
    sendServer(jsonData); // convert string
    process.stdout.write(JSON.stringify(jsonData));
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
  });

}).listen(port);

process.stdout.write(`Station: running at port - ${port}\n`);
