var ROOM_ID;
var LAST_TIMESTAMP = 0;
var LOCAL_ID = getLocalId();

$(document).ready(function() {
    disableAllInput(true);
    registerInputEventHandlers();

    RidgeAPI.registerLocalId(LOCAL_ID, function(roomId) {
        ROOM_ID = roomId;
        disableAllInput(false);
        pollForMessages();
    });
});

function pollForMessages() {
    RidgeAPI.loadMessagesForRoom(ROOM_ID, LOCAL_ID, LAST_TIMESTAMP, function(messages) {
        if (messages.length > 0) {
            for (var i=0;i<messages.length;i++) {
                addMessage(messages[i]);
                LAST_TIMESTAMP = messages[i].timestamp;
            }
        }
        pollForMessages();
    });
}

function addMessage(message) {
    var messageElement = $("<div></div>").addClass("alert");
    var messageVal = "";

    if (message.user_id == "0") {
        messageElement = messageElement.addClass("alert-warning");
        if (message.msg_type == "JOIN") {
            if (message.message == LOCAL_ID) {
                messageVal = "<strong>You</strong> joined the room.";
            }
            else {
                messageVal = "<strong>Stranger</strong> joined the room.";
            }
        }
        else if (message.msg_type == "LEFT") {
            messageVal = "<strong>Stranger</strong> left the room.";
        }
    }

    else {
        if (message.user_id == LOCAL_ID) {
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

    // Auto scroll to bottom code
    // http://stackoverflow.com/a/12391116
    $("#chat-box").stop().animate({
        scrollTop: $("#chat-box")[0].scrollHeight
    }, 800);
}

function disableAllInput(shouldDisable) {
    $("#input-message").prop("disabled", shouldDisable);
}

function registerInputEventHandlers() {
    $("#form-message").submit(function(e) {
        var message = $("#input-message").val();
        RidgeAPI.addMessageForRoom(ROOM_ID, LOCAL_ID, message, function() {
        });

        $("#input-message").val("");
        return false;
    });
}

function getLocalId() {
    // Uncomment this to make sure that the same user won't be in the same
    // room as himself
    /*
    var localId = window.localStorage["localId"];
    if (!localId) {
        localId = getRandomId(10);
        window.localStorage["localId"] = localId;
    }
    return localId;
    */

    return getRandomId(10);
}

function getRandomId(length) {
    // Shamelessly taken from csharptest.net's answer on SO
    // http://stackoverflow.com/a/1349426
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}