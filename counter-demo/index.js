var Server = require('./controller/server').Server;

var server = new Server();
server.start(8888);
console.log(Object.keys(server));

module.exports.server = server;
