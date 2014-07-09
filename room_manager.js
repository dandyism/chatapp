var RoomManager = function () {
  this.rooms = {};
};

RoomManager.prototype.add = function (id, room) {
  if (this.rooms[id]) {
    this.rooms[id].push(room);
  } else {
    this.rooms[id] = [];
  }
};

RoomManager.prototype.eachRoom = function (id, callback) {
  this.rooms[id].forEach(callback);
};

RoomManager.prototype.delete = function (id, room) {
  var index = this.rooms[id].indexOf(room);
  this.rooms[id].splice(index, 1);
};