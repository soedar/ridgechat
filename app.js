var express = require("express");
var app = express();
var port = 22222;
var timeout = 6000;

var RoomManager = require("./models/room_manager").RoomManager;
var Message = require("./models/message").Message;

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

app.get("/room/:room_id/messages/:last_timestamp", function(req, res) {
    var room = RoomManager.roomList[req.params.room_id];

    var output;
    var messages = room.messagesSince(req.params.last_timestamp);

    if (messages.length > 0) {
        output = {"success": true, "messages": messages};
        res.send(output);
    }

    else {
        room.addListener(timeout, {success: function(message) {
            output = {"success": true, "messages": message};
            res.send(output);
        },
        timeout: function() {
            output = {"success": true, "messages": []};
            res.send(output);
        }});
    }
});

app.get("/stats", function(req, res) {
    res.send({"rooms": RoomManager.roomList});
});

app.post("/room/:room_id/:user_id/post", function(req, res) {
    var room = RoomManager.roomList[req.params.room_id];
    if (!room) {
        res.send({"success": false});
        return;
    }

    var user_id = req.params.user_id;
    var userInChat = false;
    for (var i=0;i<room.user_ids.length;i++) {
        if (room.user_ids[i] == user_id) {
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

app.listen(port);
console.log("Listening on port " + port);