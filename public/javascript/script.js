var ROOM_ID;

$(document).ready(function() {
    disableAllInput(true);
    var localId = getLocalId();

    registerInputEventHandlers();

    RidgeAPI.registerLocalId(localId, function(roomId) {
        ROOM_ID = roomId;
        disableAllInput(false);
        pollForMessages(roomId);
        window.setInterval(function() { pollForMessages(roomId) }, 5000);
    });
});


function pollForMessages(roomId) {
    RidgeAPI.loadMessageForRoom(roomId, function(messages) {
        $('#chat-box').empty();
        for (var i=0;i<messages.length;i++) {
            addMessage(messages[i]);
        }
    });
}

function addMessage(message) {
    var localId = getLocalId();
    var messageElement = $("<div></div>").addClass("alert");
    var messageVal = "";

    if (message.user_id == "0") {
        messageElement = messageElement.addClass("alert-warning");
    }

    else if (message.user_id == localId) {
        messageElement = messageElement.addClass("alert-success");
        messageVal = "<strong>You: </strong>";
    }

    else {
        messageElement = messageElement.addClass("alert-info");
        messageVal = "<strong>Stranger: </strong>";
    }

    messageVal += message.message;
    messageElement.html(messageVal);

    $("#chat-box").append(messageElement);
}

function disableAllInput(shouldDisable) {
    $("#input-message").prop("disabled", shouldDisable);
}

function registerInputEventHandlers() {
    $("#form-message").submit(function(e) {
        var message = $("#input-message").val();
        var localId = getLocalId();
        RidgeAPI.addMessageForRoom(ROOM_ID, localId, message, function() {
            pollForMessages(ROOM_ID);
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