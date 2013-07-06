var SystemMessage = require("./message").SystemMessage;
var Utility = require("../utility").Utility;
var Config = require("../config").Config;

RoomManager = function() {
    this.roomList = {};
    this.availableRoomList = [];
};

RoomManager.prototype.roomForUserId = function(userId, callback) {
    this.clearInactiveRooms();

    var selectedRoom = -1;

    for (var i=0;i<this.availableRoomList.length;i++) {
        var room = this.availableRoomList[i];
        if (room.userIds[0] != userId) {
            selectedRoom = i;
            break;
        }
    }

    var room;
    // There are no room available for the user
    if (selectedRoom == -1) {
        room = new Room(userId);
        this.availableRoomList.push(room);
        this.roomList[room.identifier] = room;
    }
    else {
        room = this.availableRoomList.splice(selectedRoom, 1)[0];
        room.addUser(userId);
    }
    room.addMessage(new SystemMessage("JOIN", userId));
    callback(room);
}

RoomManager.prototype.clearInactiveRooms = function() {
    var inactiveRoomIndexes = [];
    for (var i=0;i<this.availableRoomList.length;i++) {
        var room = this.availableRoomList[i];
        room.clearInactiveUsers(Config.inactiveTimeout);

        var userIds = Object.keys(room.lastListenerTime);
        if (userIds.length == 0) {
            inactiveRoomIndexes.push(i);
        }
    }

    for (var i=0;i<inactiveRoomIndexes.length;i++) {
        var index = inactiveRoomIndexes[i];
        this.availableRoomList.splice(index, 1);
    }
}

Room = function(userId) {
    this.userIds = [userId];
    this.identifier = Utility.getRandomId(10);
    this.messages = [];
    this.listeners = {};
    this.lastListenerTime = {};
}

Room.prototype.addUser = function(userId) {
    this.userIds.push(userId);
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
    this.listeners[listener.userId] = listener;
    listener.activateTimer();

    this.lastListenerTime[listener.userId] = (new Date()).getTime();
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

Room.prototype.clearInactiveUsers = function(timeout) {
    var inactiveUserIds = this.inactiveUsers(timeout);
    for (var i=0;i<inactiveUserIds.length;i++) {
        var inactiveUserId = inactiveUserIds[i];
        this.addMessage(new SystemMessage("LEFT", inactiveUserId));
        delete this.lastListenerTime[inactiveUserId];
    }
}

Room.prototype.inactiveUsers = function(timeout) {
    var inactiveUserIds = [];

    var userIds = Object.keys(this.lastListenerTime);
    var currentTime = (new Date()).getTime();

    for (var i=0;i<userIds.length;i++) {
        var userId = userIds[i];
        var listenerTime = this.lastListenerTime[userId];

        if (currentTime - listenerTime > timeout) {
            inactiveUserIds.push(userId);
        }
    }

    return inactiveUserIds;
}

exports.RoomManager = new RoomManager();