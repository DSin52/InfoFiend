var express = require("express");
var User = require("../models/User.js");




function init(req, res, next) {
	req.User = new User(req.db);
	next(); 
}

var userAPI = express();

userAPI.all("/users*", init);

userAPI.post("/users/create", express.bodyParser(), function (req, res, next) {
	var userAccount = {
		"Email": req.body.Email,
		"First_Name": req.body.First_Name,
		"Last_Name": req.body.Last_Name,
		"Username": req.body.Username,
		"Password": req.body.Password
	};

	req.User.createUser(userAccount, function (err, result) {
		if (err) {
			res.send(res.statusCode, {"Error": err});
		} else {
			res.send(201, {"userKey": result[0]._id});
		}
	});
});

module.exports = userAPI;