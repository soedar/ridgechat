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
    }
    else {
        room = this.availableRoomList.splice(selectedRoom,1)[0];
        room.addUser(user_id);
        this.roomList[room.identifier] = room;
    }
    callback(room);
}

exports.RoomManager = RoomManager;


Room = function(user_id) {
    this.user_ids = [user_id];
    this.identifier = randomId();
    this.messages = [];
}

Room.prototype.addUser = function(user_id) {
    this.user_ids.push(user_id);
}


// Shamelessly taken from csharptest.net's answer on SO
// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript/8084248#8084248
function randomId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}