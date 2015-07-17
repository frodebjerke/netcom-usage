const server = require('./lib/server');
const config = require('./config');

console.log('Starting server on:', config.serverPort)
server.run(config);
