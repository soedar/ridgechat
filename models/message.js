Message = function(user_id, message) {
    this.user_id = user_id;
    this.message = message;
    this.timestamp = (new Date()).getTime();
}

SystemMessage = function(message) {
    this.user_id = "0";
    this.message = message;
    this.timestamp = (new Date()).getTime();
}

exports.Message = Message;
exports.SystemMessage = SystemMessage;