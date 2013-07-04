var express = require("express");
var app = express();
var port = 22222;

var RoomManager = require("./models/room_manager").RoomManager;
RoomManager = new RoomManager();

app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
});

app.get("/", function(req, res) {
    res.send("It Works");
});

app.get("/register/:user_id", function(req, res) {
    RoomManager.roomForUserId(req.params.user_id, function(room) {
        res.send(room.identifier);
    });
});

app.listen(port);
console.log("Listening on port " + port);