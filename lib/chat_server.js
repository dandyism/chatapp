var socketio = require('socket.io');

var socketIndex = 1;
var usernames = {};

var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    var username = 'guest' + socketIndex;
    
    usernames[socket.id] = username;
    socketIndex += 1;
    
    io.sockets.emit('notification', username + ' has joined the room')    
    
    socket.on('clientMessage', function(data) {
      io.sockets.emit('serverMessage', {
        username: usernames[socket.id],
        message: data
      });
    });
    
    socket.on('nicknameChangeRequest', function(data) {
      
      var success = true;
      var message = "";
      
      Object.keys(usernames).forEach(function(key) {
        if(usernames[key] === data) {
          success = false;
          message = 'nickname "' + data + '" is already in use';
        };
      });
      
      if (success) {
        io.sockets.emit('notification', usernames[socket.id] + " has changed their nick to " + data);
        usernames[socket.id] = data;
      }
      
      socket.emit('nicknameChangeResult', {
        success: success,
        message: message
      });
    });

    socket.on('disconnect', function() {
      io.sockets.emit('notification', usernames[socket.id] + " has left the room");
      delete usernames[socket.id];
    });
  });
};

module.exports.listen = listen;