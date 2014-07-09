var RoomsManager = function() {
  this.rooms = {};
  
};

RoomsManager.prototype.add = function (roomName, message, username) {
  if (!this.rooms[roomName]) this.rooms[roomName] = [];
  
  this.rooms[roomName].push({
    message: message,
    username: username
  });
};

RoomsManager.prototype.eachMessage = function (roomName, callback) {
  _(this.rooms[roomName]).each(callback);
};