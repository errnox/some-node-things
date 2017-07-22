var http = require('http');

var Server = (function() {
  function Server() {
    var self = this;
  }

  Server.prototype = new (function() {
    var self = this;
    self.reqNumber = 0;
    this.onRequest = function(req, resp) {
      ++self.reqNumber;
      resp.writeHead((200, {'Content-Type:': 'text/plain'}));
      resp.write('<h1>Request #' + self.reqNumber + '</h1>');

      resp.end();
    };

    this.start = function(port) {
      http.createServer(this.onRequest).listen(port);
      console.log('Start server.')
      console.log(__dirname);
      console.log(module.filename);
    };
   })();

  return Server;
})();


module.exports.Server = Server;
