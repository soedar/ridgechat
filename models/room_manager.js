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
    room.addMessage(new SystemMessage("JOIN", user_id));
    callback(room);
}

Room = function(user_id) {
    this.user_ids = [user_id];
    this.identifier = Utility.getRandomId(10);
    this.messages = [];
    this.listeners = {};
}

Room.prototype.addUser = function(user_id) {
    this.user_ids.push(user_id);
}

Room.prototype.addMessage = function(message) {
    this.messages.push(message);

        var listenerIds = Object.keys(this.listeners);
        for (var i=0;i<listenerIds.length;i++) {
            var listenerId = listenerIds[i];
            var listener = this.listeners[listenerId];
            listener.sendMessages([message]);
        }
}

Room.prototype.addListener = function(listener) {
    this.listeners[listener.user_id] = listener;
    listener.activateTimer();
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