var express = require("express");
var app = express();


var RoomManager = require("./models/room_manager").RoomManager;
var Message = require("./models/message").Message;
var MessageListener = require("./models/message_listener").MessageListener;
var Config = require("./config").Config;

app.configure(function() {
    app.use(express.static(__dirname + "/public"));
    app.use(express.bodyParser());
})

app.get("/", function(req, res) {
    res.sendfile("./public/index.html");
});

app.get("/register/:user_id", function(req, res) {
    RoomManager.roomForUserId(req.params.user_id, function(room) {
        var output;
        if (room) {
            output = {"success": true, "room_id": room.identifier}
        }
        else {
            output = {"success": false};
        }
        res.send(output);
    });
});

app.get("/room/:room_id/:user_id/messages/:last_timestamp", function(req, res) {
    var room = RoomManager.roomList[req.params.room_id];
    room.clearInactiveUsers(Config.inactiveTimeout);

    var output;
    var messages = room.messagesSince(req.params.last_timestamp);

    if (messages.length > 0) {
        output = {"success": true, "messages": messages};
        res.send(output);
    }

    else {
        var listener = new MessageListener(req.params.user_id, Config.timeout);
        listener.addSuccessCallback(function(messages) {
            output = {"success": true, "messages": messages};
            res.send(output);
        });

        listener.addTimeoutCallback(function() {
            output = {"success": true, "messages": []};
            res.send(output);
        });

        room.addListener(listener);
    }
});

app.post("/room/:room_id/:user_id/post", function(req, res) {
    var room = RoomManager.roomList[req.params.room_id];
    if (!room) {
        res.send({"success": false});
        return;
    }

    var user_id = req.params.user_id;
    var userInChat = false;
    for (var i=0;i<room.userIds.length;i++) {
        if (room.userIds[i] == user_id) {
            userInChat = true;
            break;
        }
    }

    if (!userInChat) {
        res.send({"success": false});
        return;
    }

    var message = new Message(user_id, req.body.message);
    room.addMessage(message);
    res.send({"success": true});
});

app.get("/stats", function(req, res) {
    var rooms = [];

    var roomList = RoomManager.roomList;
    var roomIdentifiers = Object.keys(roomList);
    for (var i=0;i<roomIdentifiers.length;i++) {
        var identifier = roomIdentifiers[i];
        var room = roomList[identifier];
        rooms.push({"user_ids": room.user_ids,
                    "identifier": identifier,
                    "messages": room.messages});
    }

    res.send({"rooms": rooms});
});

app.listen(Config.port);
console.log("Listening on port " + Config.port);