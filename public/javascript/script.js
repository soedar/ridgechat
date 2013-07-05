var ROOM_ID;
var LAST_TIMESTAMP = 0;
var LOCAL_ID = null;

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
        else if (message.msg_type == "LEFT") {
            messageVal = "<strong>Stranger</strong> left the room.";
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
        var localId = getLocalId();
        RidgeAPI.addMessageForRoom(ROOM_ID, localId, message, function() {
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

    if (!LOCAL_ID) {
        LOCAL_ID = getRandomId(10);
    }
    return LOCAL_ID;
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