var socketio = require('socket.io');

var socketIndex = 1;
var usernames = {};

var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    var username = 'guest' + socketIndex;
    socket.id = socketIndex;
    socketIndex += 1;
    
    usernames[socket.id] = username;
    
    socket.on('clientMessage', function(data) {
      io.sockets.emit('serverMessage', {
        username: usernames[socket.id],
        message: data
      });
    })
  });
  
};

module.exports.listen = listen;