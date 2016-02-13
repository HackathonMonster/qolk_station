'use strict';

const net = require('net');
const http = require('http');
const querystring = require('querystring');

const clients = [];

const port = 3001;

const sendServer = (data) => {
  const postData = querystring.stringify({
    data
  });
  const options = {
    hostname: 'localhost',
    port: 80,
    path: '/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    // process.stdout.write(`Server: status - ${res.statusCode}`);
    // process.stdout.write(`Server: headers - ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    // res.on('data', (chunk) => {
    //   process.stdout.write(`Server: body - ${chunk}`);
    // });
    // res.on('end', () => {
    // });
  });

  req.on('error', (e) => {
    process.stdout.write(`Server: problem with request - ${e.message}`);
  });

  req.write(postData);
  req.end();
};

const convert = (data) => {
  const hex2decimal = (hex) => {
    return hex[0] << 8 | hex[1];
  };
  return {
    'humidity': hex2decimal(data.slice(0, 2).split('')),
    'temperature': hex2decimal(data.slice(2, 4).split('')),
    'alcohol': hex2decimal(data.slice(4, 6).split(''))
  };
};

net.createServer((socket) => {
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.push(socket);

  socket.on('data', (data) => {
    clients[clients.indexOf(socket)].write(data);
    process.stdout.write(`Station: get data - ${data}`);
    sendServer(convert(`${data}`)); // convert string
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
  });

}).listen(port);

process.stdout.write(`Station: running at port - ${port}\n`);
