
/**
 * Module dependencies.
 */

var express = require('express');
var http = require("http");
var MongoClient = require("mongodb").MongoClient;
var Server = require("mongodb").Server;
var Db = require("mongodb").Db;
var app = express();
var userAPI = require("./routes/userAPI.js");
var chatAPI = require("./routes/chatAPI.js");
var _db;


// all environments
app.set('port', process.env.PORT || 3000);
app.use(function (req, res, next) {
	req.db = _db;
	next();
});

app.use("/api", userAPI);
app.use("/api", chatAPI);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

MongoClient.connect("mongodb://127.0.0.1:27017/InfoFiend", function (err, db) {

	if (err) {
		throw err;
	}

	_db = db;
	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
