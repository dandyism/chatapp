var socketio = require('socket.io');
var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    socket.on('clientMessage', function(data) {
      io.sockets.emit('serverMessage', data);
    })
  });
  
};

module.exports.listen = listen;