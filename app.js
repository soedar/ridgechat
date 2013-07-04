var express = require("express");
var app = express();
var port = 22222;

var RoomManager = require("./models/room_manager").RoomManager;

app.get("/", function(req, res) {
    res.send("It Works");
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

app.get("/room/:room_id/messages", function(req, res) {
    var room = RoomManager.roomList[req.params.room_id];
    var output;
    if (room) {
        output = {"success": true, "messages": room.messages};
    }
    else {
        output = {"success": false};
    }
    res.send(output);
});

app.listen(port);
console.log("Listening on port " + port);