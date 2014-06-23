var socketio = require('socket.io');

var socketIndex = 1;
var usernames = {};

var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    var username = 'guest' + socketIndex;
    socketIndex += 1;
    
    usernames[socketIndex] = username;
    
    socket.on('clientMessage', function(data) {
      io.sockets.emit('serverMessage', {
        username: usernames[socketIndex],
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
        usernames[socketIndex] = data;
      }
      
      socket.emit('nicknameChangeResult', {
        success: success,
        message: message
      });
    });
  });
  
};

module.exports.listen = listen;