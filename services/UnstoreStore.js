// UnstoreStore.js
/*jshint node: true*/
'use strict';

/**
 * One day in seconds.
 */
// var oneDay = 86400;

/**
 * The fixed tenant
 */
var tenant = 'usession';

/**
 * Return the `UnstoreStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

	/**
	 * Connect's Store.
	 */

	var Store = connect.Store || connect.session.Store;

	/**
	 * Memory Session Cache
	 */
	var cache = {};

	/**
	 * Do you want debug log messages?
	 */
	var debug = false;

	/**
	 * Initialize UnstoreStore with the given `options`.
	 *
	 * @param {Object} options
	 * @api public
	 */

	function UnstoreStore(options) {

		options = options || {};
		Store.call(this, options);
		this.type = options.sessname || 'sess';

		this.us = options.unstore;
		this.ttl =  options.ttl;
	}

	/**
	 * Inherit from `Store`
	 */

	UnstoreStore.prototype = Object.create(Store.prototype);
	UnstoreStore.prototype.constructor = UnstoreStore;

	UnstoreStore.prototype.log = function(level, text) {
		if (level === 'debug' && debug) {
			console.log(text);
		}
	};

	/**
	 * Attempt to fetch session by the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Function} fn
	 * @api public
	 */

	UnstoreStore.prototype.get = function(sid, fn){
		var me = this;
		this.log('debug', 'BEGIN ---- UnstoreStore.get ' + sid);
		var cb = function (err, data) {
			if (err) {
				me.log('debug', '* complete session get with error ' + err.error);
			} else {
				me.log('debug', '* complete session get without error ');
			}
			fn(err, data);
		};

		if (cache[sid]) {
			var result;
			try {
				result = JSON.parse(cache[sid]);
			} catch (err) {
				return cb(err);
			}
			return cb(null, result);			
		}

		this.us.fetchByTypeId(this.type, sid, tenant, {'_GOD':'_GOD'}, function(err,data) {
			if (err && err.error === 'not_found') return cb();
			if (err) return cb(err);
			if (!data) return cb();
			var result;
			try {
				result = JSON.parse(data.obj.sess);
			} catch (err) {
				return cb(err);
			}
			cache[sid] = data.obj.sess;
			return cb(null, result);
		});
		this.log('debug', 'END ---- UnstoreStore.get ' + sid);	
	};

	/**
	 * Commit the given `sess` object associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Session} sess
	 * @param {Function} fn
	 * @api public
	 */

	UnstoreStore.prototype.set = function(sid, sess, fn){
		var me = this;
		this.log('debug', 'BEGIN ---- UnstoreStore.set ' + sid);
		var cb = function (err) {
			if (err) {
				me.log('debug', '* complete session set with error ' + err.error);
			} else {
				me.log('debug', '* complete session set without error ');
			}
			fn(err);
		};

		sess = JSON.stringify(sess);

		if (cache[sid]) {
			if (cache[sid] === sess) {
				return cb(null);
			}
		}

		me.us.fetchByTypeId(this.type, sid, tenant, {'_GOD':'_GOD'}, function(err,data) {
			if (err) {
				if (err.error === 'not_found') {
					data = {
						type: me.type,
						id: sid,
						acl: {
							readers: {'_GOD':'_GOD'},
							writers: {'_GOD':'_GOD'}
						},
						obj: {
							sess: ''
						},
						partition: tenant
					};
				} else {
					me.log('debug', 'error in fetch from session set' + err.error);
					return cb(err);
				}
			}
			
			if (data.obj.sess !== sess) {
				me.log('debug', '-------- session data ---------');
				me.log('debug', '\told: ' + data.obj.sess);
				me.log('debug', '\tnew: ' + sess);
				me.log('debug', '-------------------------------');
				data.obj.sess = sess;
				cache[sid] = sess;
				me.us.dataObjectSave(data, {'_GOD':'_GOD'}, cb);
			} else {
				cb(null);
			}
		});
		this.log('debug', 'END ---- UnstoreStore.set ' + sid);
	};

	/**
	 * Destroy the session associated with the given `sid`.
	 *
	 * @param {String} sid
	 * @api public
	 */

	UnstoreStore.prototype.destroy = function(sid, fn){
		var me = this;
		me.us.fetchByTypeId(this.type, sid, tenant, {'_GOD':'_GOD'}, function(err,data) {
			if (err) {
				if (err.error === 'not_found') {
					me.log('debug', 'nothing to delete. Session ' + sid + ' not found');
					return fn(null);
				} else {
					console.dir(err);
					return fn(err);
				}
			}
			me.us.dataObjectSave(data, {'_GOD':'_GOD'}, fn, true);
		});
	};

	return UnstoreStore;
};