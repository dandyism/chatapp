var Chat = function (socket) {
  this.socket = socket
};

Chat.prototype.sendMessage = function (message) {
  this.socket.emit('clientMessage', message);
};

Chat.prototype.processCommand = function (command, args) {
  if(command === '/nick') {
    this.socket.emit('nicknameChangeRequest', args);
  }
};