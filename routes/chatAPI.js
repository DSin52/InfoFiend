var express = require("express");
var Chat = require("../models/Chat.js");
var User = require("../models/User.js");
var ObjectID = require('mongodb').ObjectID;
var obj = new ObjectID();

function init(req, res, next) {
	req.Chat = new Chat(req.db);
	req.User = new User(req.db);
	next(); 
}

var chatAPI = express();

chatAPI.all("/chat*", init);

chatAPI.post("/chat/:room", express.bodyParser(), function (req, res, next) {
	
	//need to look up _id via req.query params so that i can identify the user
	//then hook up sockets to this modularly..somehow?? After all that is done, 
	//make sure database picks up multiple chat rooms


	// console.log("QUERY: " + req.query.userKey);
	// req.User.findUser({"_id": req.query.userKey.toHexString()}, function (err, result) {
	// 	console.log(result);
	// });

	var Message = {
		"Username": req.body.Username,
		"Message": req.body.Message
	};

	req.Chat.addMesage(req.params.room, Message, function (err, result) {
		if (err) {
			res.send(res.statusCode, {"Error": err});
		} else {
			res.send(201);
		}
	});
});

chatAPI.get("/chat/:room", function (req, res, next) {
	req.Chat.getAllMessages(req.params.room, function (err, items) {
		res.send(items);
	});
});

module.exports = chatAPI;