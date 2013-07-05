var ROOM_ID;
var LAST_TIMESTAMP = 0;

$(document).ready(function() {
    disableAllInput(true);
    var localId = getLocalId();

    registerInputEventHandlers();

    RidgeAPI.registerLocalId(localId, function(roomId) {
        ROOM_ID = roomId;
        disableAllInput(false);
        pollForMessages(roomId);
    });
});

function pollForMessages(roomId) {
    RidgeAPI.loadMessagesForRoom(roomId, LAST_TIMESTAMP, function(messages) {
        if (messages.length > 0) {
            for (var i=0;i<messages.length;i++) {
                addMessage(messages[i]);
                LAST_TIMESTAMP = messages[i].timestamp;
            }
        }
        pollForMessages(roomId);
    });
}

function addMessage(message) {
    var localId = getLocalId();
    var messageElement = $("<div></div>").addClass("alert");
    var messageVal = "";

    if (message.user_id == "0") {
        messageElement = messageElement.addClass("alert-warning");
        if (message.msg_type == "JOIN") {
            if (message.message == localId) {
                messageVal = "<strong>You</strong> joined the room.";
            }
            else {
                messageVal = "<strong>Stranger</strong> joined the room.";
            }
        }
    }

    else {
        if (message.user_id == localId) {
            messageElement = messageElement.addClass("alert-success");
            messageVal = "<strong>You: </strong>";
        }

        else {
            messageElement = messageElement.addClass("alert-info");
            messageVal = "<strong>Stranger: </strong>";
        }

        messageVal += message.message;
    }

    messageElement.html(messageVal);
    $("#chat-box").append(messageElement);
    $("#chat-box").stop().animate({
        scollTop: $("#chat-box").scrollHeight
    }, 800);
}

function disableAllInput(shouldDisable) {
    $("#input-message").prop("disabled", shouldDisable);
}

function registerInputEventHandlers() {
    $("#form-message").submit(function(e) {
        var message = $("#input-message").val();
        var localId = getLocalId();
        RidgeAPI.addMessageForRoom(ROOM_ID, localId, message, function() {
        });

        $("#input-message").val("");
        return false;
    });
}

function getLocalId() {
    var localId = window.localStorage["localId"];
    if (!localId) {
        localId = getRandomId(10);
        window.localStorage["localId"] = localId;
    }
    return localId;
}

function getRandomId(length) {
    // Shamelessly taken from csharptest.net's answer on SO
    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript/8084248#8084248

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}