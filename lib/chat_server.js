var socketio = require('socket.io');
var RoomManager = require('./room_manager');

var socketIndex = 1;
var usernames = {};
var rooms = new RoomManager;

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
    rooms.add(socket.id, "lobby");
    socketIndex += 1;
    
    rooms.eachRoom(socket.id, function(room) { 
      socket.join(room, function(err) {
        io.sockets.in(room).emit('notification', usernames[socket.id] + ' has joined the room');
        pushUserList(io, room);
      });
    });
        
    socket.on('clientMessage', function(data) {
      rooms.eachRoom(socket.id, function(room) {
        io.sockets.in(room).emit('serverMessage', {
          username: usernames[socket.id],
          message: data
        });
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
        rooms.eachRoom(socket.id, function(room) {
          io.sockets.in(room)
            .emit('notification', usernames[socket.id] + " has changed their nick to " + data);
        });
        
        usernames[socket.id] = data;
      }
      
      socket.emit('nicknameChangeResult', {
        success: success,
        message: message
      });
      
      rooms.eachRoom(socket.id, function(room) {
        pushUserList(io, room);
      });
    });

    socket.on('disconnect', function() {
      rooms.eachRoom(socket.id, function(room) {
        io.sockets.in(rooms).emit('notification', usernames[socket.id] + " has left the room");
      });
      
      delete usernames[socket.id];
      
      rooms.eachRoom(socket.id, function(room) {
        pushUserList(io, room);
      });
    });
        
    socket.on('roomJoin', function(roomName) {
      rooms.eachRoom(socket.id, function(room) {
        io.sockets.in(room).emit('notification', usernames[socket.id] + " has left the room")
        pushUserList(io, room);
      });

      
      socket.join(roomName, function(err) {
        io.sockets.in(roomName).emit('notification', usernames[socket.id] + ' has joined the room');
        rooms.add(socket.id, roomName);
        pushUserList(io, roomName);
      });
    })  
  });
};

module.exports.listen = listen;