var express = require("express");
var app = express();
var port = 22222;

var RoomManager = require("./models/room_manager").RoomManager;

app.get("/", function(req, res) {
    res.send("It Works");
});

app.get("/register/:user_id", function(req, res) {
    RoomManager.roomForUserId(req.params.user_id, function(room) {
        res.send(room);
    });
});

app.listen(port);
console.log("Listening on port " + port);