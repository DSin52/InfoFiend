var bcrypt = require("bcrypt");
var async = require("async");
var USERS = "Users";
var self;
function User(db) {
	this.collection = db.collection(USERS);
	self = this;
}

User.prototype = {

	"createUser": function(account, callback) {
		async.waterfall([
			function (next) {
				self.checkExists(account, next);
			},
			function (next) {
				hashPassword(account.Password, next);
			},
			function (hashedPw, next) {
				account["Password"] = hashedPw;
				next(null, account);
			},
			function (user, next) {
				self.collection.insert(user, next);
			}
		],
		function (err, user) {
			if (err) {
				callback(err);
			} else {
				callback(null, user);
			}
		});
	},

	"checkExists": function(account, callback) {
		async.waterfall([
			function (next) {
				self.collection.findOne({"Email": account.Email}, next);
			},
			function (user, next) {
				if (user) {
					next("Email already exists!");
				} else {
					self.collection.findOne({"Username": account.Username}, next);
				}
			}
		],
		function (err, account) {
			if (err) {
				callback(err);
			} else if (account) {
				callback("Username already exists!");
			} else {
				callback();
			}
		});
	},

	"findUser": function (query, callback) {
		self.collection.findOne(query, callback);
	}
};

function hashPassword(password, callback) {
	async.waterfall([
		function (next) {
			bcrypt.genSalt(3, next);
		},
		function (salt, next) {
			bcrypt.hash(password, salt, next);
		}
	], function (err, results) {
		if (err) {
			callback(new Error("Error in hashing password"));
		} else {
			callback(null, results);
		}
	});
};

module.exports = User;