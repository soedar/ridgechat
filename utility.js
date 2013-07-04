Utility = function() {};

Utility.prototype.getRandomId = function(length) {
    // Shamelessly taken from csharptest.net's answer on SO
    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript/8084248#8084248

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.Utility = new Utility();