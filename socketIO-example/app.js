#!/usr/bin/env node

var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, static = require('node-static');


var root = this;

var PORT = 8081;
app.listen(PORT);
console.log('Server running on port: ' + PORT);  // DEBUG

var STATIC_DIR = './public';
var fileServer = new static.Server(STATIC_DIR);

function handler (req, res) {
  fileServer.serve(req, res);

  // fs.readFile(__dirname + '/index.html',
  // 	      function (err, data) {
  // 		if (err) {
  // 		  res.writeHead(500);
  // 		  return res.end('Error loading index.html');
  // 		}

  // 		res.writeHead(200);
  // 		res.end(data);
  // 	      });
}

var counter = 0;
var doRefresh = true;
var RES_DIR = '/public/res/';

io.sockets.on('connection', function (socket) {
  if (doRefresh) {
    socket.emit('refresh', {delay: 0});
  }
  doRefresh = false;

  setInterval(function() {
    ++counter;

    fs.readdir(__dirname + RES_DIR, function(err, files) {
      var data = fs.readFile(
	__dirname + RES_DIR + files[
	  Math.floor(Math.random() * files.length)],
	'utf-8', function(err, data) {
	  if (err) {
	    throw err;
	  }
	  socket.emit('news', JSON.parse(data));
	});
    });

  }, 1000);

  socket.on('test event', function (data) {
  });
});
