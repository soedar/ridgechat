Message = function(user_id, message) {
    this.user_id = user_id;
    this.message = message;
    this.timestamp = (new Date()).getTime();
}