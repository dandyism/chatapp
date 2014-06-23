var socketio = require('socket.io');

var socketIndex = 1;
var usernames = {};
var rooms = {};

var pushUserList = function(io, room) {
  var _usernames = [];
  
  Object.keys(usernames).forEach(function(key) {
    if(rooms[key] === room) {
      _usernames.push(usernames[key]);
    }
  });
  
  io.sockets.in(room).emit('userList', _usernames);
};

var listen = function(server) {
  var io = socketio.listen(server);
  io.on('connection', function(socket) {
    var username = 'guest' + socketIndex;
    
    usernames[socket.id] = username;
    rooms[socket.id] = "lobby";
    socketIndex += 1;
    
    socket.join(rooms[socket.id], function(err) {
      io.sockets.in(rooms[socket.id]).emit('notification', username + ' has joined the room');
      pushUserList(io, rooms[socket.id]);
    });
        
    socket.on('clientMessage', function(data) {
      io.sockets.in(rooms[socket.id]).emit('serverMessage', {
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
        io.sockets.in(rooms[socket.id]).emit('notification', usernames[socket.id] + " has changed their nick to " + data);
        usernames[socket.id] = data;
      }
      
      socket.emit('nicknameChangeResult', {
        success: success,
        message: message
      });
      
      pushUserList(io, rooms[socket.id]);
    });

    socket.on('disconnect', function() {
      io.sockets.in(rooms[socket.id]).emit('notification', usernames[socket.id] + " has left the room");
      
      delete usernames[socket.id];
      pushUserList(io, rooms[socket.id]);
    });
        
    socket.on('roomJoin', function(roomName) {
      io.sockets.in(rooms[socket.id]).emit('notification', usernames[socket.id] + " has left the room")
      rooms[socket.id] = "";
      pushUserList(io, rooms[socket.id]);
      socket.leave(rooms[socket.id]);
      
      socket.join(roomName, function(err) {
        io.sockets.in(roomName).emit('notification', username + ' has joined the room');
        rooms[socket.id] = roomName;
        pushUserList(io, rooms[socket.id]);
      });
    })  
  });
};

module.exports.listen = listen;