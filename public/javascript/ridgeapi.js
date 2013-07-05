RidgeAPIClass = function() {};

RidgeAPIClass.prototype.registerLocalId = function(localId, callback) {
    $.get("register/" + localId, function(data) {
        if (data.success) {
            callback(data.room_id);
        }
        else {
            callback(null);
        }
    });
}

RidgeAPIClass.prototype.loadMessagesForRoom = function(roomId, lastTimestamp, callback) {
    $.get("/room/" + roomId + "/messages/" + lastTimestamp, function(data) {
        if (data.success) {
            callback(data.messages);
        }
        else {
            callback(null);
        }
    });
}

RidgeAPIClass.prototype.addMessageForRoom = function(roomId, userId, messageVal, callback) {
    var data = {message: messageVal};
    $.post("/room/" + roomId + "/" + userId + "/post", data, function(data) {
        callback()
    });
};


RidgeAPI = new RidgeAPIClass();