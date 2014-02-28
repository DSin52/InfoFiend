var express = require("express");
var Chat = require("../models/Chat.js");
var User = require("../models/User.js");
var ObjectID = require('mongodb').ObjectID;
var async = require("async");

function init(req, res, next) {
	req.Chat = new Chat(req.db);
	req.User = new User(req.db);
	next(); 
}

var chatAPI = express();

chatAPI.all("/chat*", init);

chatAPI.post("/chat/:room", express.bodyParser(), function (req, res, next) {
	
	//then hook up sockets to this modularly..somehow?? After all that is done, 

	async.waterfall([
		function (next) {
			req.User.findUser({"_id": ObjectID(req.query.userKey)}, next)
		},
		function (account, next) {
			if (account) {
				var Message = {
					"Username": account.Username, 
					"Message": req.body.Message
				};
				next(null, Message);
			} else {
				next("User not found!");
			}
		},
		function (message, next) {
			req.Chat.addMessage(req.params.room, message, next);
		}
	],
		function (err, results) {
			if (err) {
				if (err === "User not found!") {
					res.send(404, {Error: err});
				} else {
					res.send(res.statusCode, {Error: err});
				}
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