var Chat = function (socket) {
  this.socket = socket;
  this.room = ["lobby"];
};

Chat.prototype.sendMessage = function (message, room) {
  this.socket.emit('clientMessage', {
    message: message,
    room: room
  });
};

Chat.prototype.processCommand = function (command, args) {
  if(command === '/nick') {
    this.socket.emit('nicknameChangeRequest', args);
  } else if(command === '/join') {
    this.socket.emit('roomJoin', args)
    this.room.push(args);
  }
};
