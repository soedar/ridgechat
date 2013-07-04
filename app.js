var express = require("express");
var app = express();
var port = 22222;

app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
});

app.get("/", function(req, res) {
    res.send("It Works");
});

app.listen(port);
console.log("Listening on port " + port);