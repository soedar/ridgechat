var SystemMessage = require("./message").SystemMessage;
var Utility = require("../utility").Utility;

RoomManager = function() {};

RoomManager.prototype.roomList = {};
RoomManager.prototype.availableRoomList = [];

RoomManager.prototype.roomForUserId = function(user_id, callback) {
    var selectedRoom = -1;

    for (var i=0;i<this.availableRoomList.length;i++) {
        var room = this.availableRoomList[i];
        if (room.user_ids[0] != user_id) {
            selectedRoom = i;
            break;
        }
    }

    var room;
    // There are no room available for the user
    if (selectedRoom == -1) {
        room = new Room(user_id);
        this.availableRoomList.push(room);
        this.roomList[room.identifier] = room;
    }
    else {
        room = this.availableRoomList.splice(selectedRoom,1)[0];
        room.addUser(user_id);
    }
    room.addMessage(new SystemMessage(user_id + " has joined the room"));
    callback(room);
}

Room = function(user_id) {
    this.user_ids = [user_id];
    this.identifier = Utility.getRandomId(10);
    this.messages = [];
    this.listeners = [];
    this.timers = [];
}

Room.prototype.addUser = function(user_id) {
    this.user_ids.push(user_id);
}

Room.prototype.addMessage = function(message) {
    this.messages.push(message);

    for (var i=0;i<this.timers.length;i++) {
        var timer = this.timers[i];
        clearTimeout(timer);
    }

    for (var i=0;i<this.listeners.length;i++) {
        var listener = this.listeners[i];
        listener.success(message);
    }

    this.listeners = [];
    this.timers = [];
}

Room.prototype.addListener = function(timeout, callbacks) {
    this.listeners.push(callbacks);
    var timer = setTimeout(function() {
        callbacks.timeout();
        this.timers = [];
    }, timeout);

    this.timers.push(timer);
}

Room.prototype.messagesSince = function(timestamp) {
    var outputMessages = [];
    var timestamp = parseInt(timestamp);

    for (var i=0;i<this.messages.length;i++) {
        var message = this.messages[i];
        if (message.timestamp > timestamp) {
            outputMessages.push(message);
        }
    } 
    return outputMessages;
}

exports.RoomManager = new RoomManager();