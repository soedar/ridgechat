$(document).ready(function() {
    disableAllInput(true);
});


function disableAllInput(shouldDisable) {
    $("#input-message").prop("disabled", shouldDisable);
}

function registerInputEventHandlers() {
    $("#form-message").submit(function(e) {
        $("#input-message").val("");

        return false;
    });
}

function localId() {
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