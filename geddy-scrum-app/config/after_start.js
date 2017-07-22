
geddy.io.sockets.on('connection', function(socket) {
  socket.emit('hello', {message: "world"});
  socket.on('message', function(message) {
    console.log(message);
  });
  socket.on('uiChange', function(data) {
    console.log('uiChange event: ' + JSON.stringify(data));
    geddy.uiChangeDispatcher.dispatch(data);
  });
});

