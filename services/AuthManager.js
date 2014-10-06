// AuthManager.js
/*jshint node: true*/
/*jslint node: true, es5:true*/
'use strict';

// AuthManager exports the services for the authentications functionalities
// The constructor require an IdentityManager instance.
module.exports = function () {

	function AuthManager(options) {
		if (!options.im) {
			throw new Error("im (identityManager) is required");
		}

		this.im = options.im;
	}

	AuthManager.prototype.isLoggedIn = function (req) {
		if (req.session) {
			return req.session.isLoggedIn;
		}
		return false;
	};

	AuthManager.prototype.login = function (req, res) {
		if (req.body.username && req.body.password && req.body.tenant) {
			var readers = {};
			readers[req.body.username] = req.body.username;
			this.im.getActorPwd(req.body.username, req.body.password, req.body.tenant, readers, function (err, user) {
				if (err) {
					res.send(err);
				} else {
					if (user === null) {
						res.send(401, 'Unauthorized');
					} else {
						req.session.isLoggedIn = true;
						req.session.userid = user.id;
						req.session.tenant = req.body.tenant;
						req.session.names = {};
						req.session.names[user.id] = user.id;
						res.send('ok');
					}
				}
			});
		} else {
			res.send(400, 'Bad Request: username, password, tenant MUST be set');
		}
	};

	AuthManager.prototype.logout = function (req, res) {
		req.session.isLoggedIn = false;
		res.send('ok');
	};

	AuthManager.prototype.register = function (req, res) {
		if (req.body.username && req.body.password && req.body.tenant) {
            var actor,
                writers;
			actor = {
				login: req.body.username,
				password: req.body.password
			};
            writers = {};
			writers[req.body.username] = req.body.username;
			this.im.createActor(actor, this.im.USER_TYPE, req.body.tenant, writers, function (err, user) {
				if (err) {
					res.send(err);
				} else {
					if (user === null) {
						res.send(401, 'Unauthorized');
					} else {
						req.session.isLoggedIn = true;
						res.send('ok');
					}
				}
			});
		} else {
			res.send(400, 'Bad Request: username, password, tenant MUST be set');
		}
	};

	return AuthManager;

};