var express = require("express");

function Chat(db) {
	this.db = db;
}

Chat.prototype = {

	"addMessage": function(chatRoom, message, callback) {
		this.db.collection(chatRoom).insert({"Username": message.Username, "said": message.Message}, callback);
	},

	"getAllMessages": function(chatRoom, callback) {
		this.db.collection(chatRoom).find({}, 
			{
				"Username": 1,
				"said": 1,
				"_id": 0
			}).toArray(callback);
	}
};

module.exports = Chat;