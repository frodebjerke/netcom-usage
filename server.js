const server = require('./lib/server');
const config = require('./config').server;

console.log('Starting server on:', config.port)
server.run(config);
