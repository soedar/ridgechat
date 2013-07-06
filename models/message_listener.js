MessageListener = function(user_id, timeout) {
    this.user_id = user_id;
    this.timeout = timeout;
    this.timer = null;
    this.callbacks = {};
};

MessageListener.prototype.addSuccessCallback = function(callback) {
    this.callbacks["success"] = callback;
}

MessageListener.prototype.addTimeoutCallback = function(callback) {
    this.callbacks["timeout"] = callback;
}

MessageListener.prototype.activateTimer = function() {
    var timeoutCallback = this.callbacks.timeout;
    this.timer = setTimeout(function() {
        timeoutCallback();
    }, this.timeout);
}

MessageListener.prototype.sendMessages = function(messages) {
    clearTimeout(this.timer);
    this.callbacks.success(messages);
}

exports.MessageListener = MessageListener;
