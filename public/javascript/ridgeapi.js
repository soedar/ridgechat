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

RidgeAPIClass.prototype.loadMessageForRoom = function(roomId, callback) {
    $.get("/room/" + roomId + "/messages", function(data) {
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
    $.post("/room/" + roomId + "/post/" + userId, data, function(data) {
        callback()
    });
};


RidgeAPI = new RidgeAPIClass();