var socketio = require('socket.io');

var socketIndex = 1;
var usernames = {};

var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    var _socketIndex = socketIndex;
    var username = 'guest' + _socketIndex;
    
    usernames[_socketIndex] = username;
    socketIndex += 1;
    
    io.sockets.emit('notification', username + ' has joined the room')    
    
    socket.on('clientMessage', function(data) {
      io.sockets.emit('serverMessage', {
        username: usernames[_socketIndex],
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
        io.sockets.emit('notification', usernames[_socketIndex] + " has changed their nick to " + data);
        usernames[_socketIndex] = data;
      }
      
      socket.emit('nicknameChangeResult', {
        success: success,
        message: message
      });
    });

    socket.on('disconnect', function() {
      io.sockets.emit('notification', usernames[_socketIndex] + " has left the room");
      delete usernames[_socketIndex];
    });
  });
};

module.exports.listen = listen;