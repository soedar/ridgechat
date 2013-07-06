Config = function() {
    this.port = process.env.PORT || 22222;  // for Heroku deployment
    this.messageTimeout = 3000;             // Determine how long to hold the http response
    this.inactiveTimeout = 8000;            // Determine the minimum time between request that a player has to make. Should be higher that the previous value
}

exports.Config = new Config();