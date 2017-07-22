var http = require('http');
var EventEmitter = require('events').EventEmitter;

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('End of request');

  var ee = new EventEmitter();

  var callbackOnce = function() {
    console.log('Singular callback');
  };

  var callbackMany = function() {
    console.log('Multiple callbacks');
  };

  ee.once('event', callbackOnce);
  ee.emit('event');
  ee.emit('event');

  console.log('Moving on...');

  ee.on('event', callbackMany);
  ee.emit('event');
  ee.emit('event');

  console.log('Ending multiple calls');

  ee.removeListener('event', callbackMany);
  ee.emit('event');
}).listen(9999);
