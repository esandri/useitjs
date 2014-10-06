/**
 * ItentityManager is a decorator of an UnStore store that implements
 * functionality to save and retrieve actors and groups
 * @module IdentityManager
 *
 * @description To create an IdentityManager you need an UnStore instance
 * @example
 * var identityManager = null;
 * var unstore = require('unodestore');
 * var identityService = require('IdentityManager');
 * 
 * var store = new unstore.UnStore();
 * store.setDriver('couchdb');
 * store.openConnection({
 *      host: 'localhost',
 *      port: '5984',
 *      ssl: false,
 *      cache: false,
 *      user: 'admin',
 *      password: 'password',
 *      database: 'identitymanager'
 * }, function(err, store) {
 *      var identityManager = identityService.getInstance(
 *                              store, 
 *                              useIt);
 * });
 *
 * var useId = function(err, im) {
 *      identityManager.getActor('username', 
 *                               'tenant', 
 *                               {'username':'username'}, 
 *                               function(err, obj){
 *          if (err) {
 *              process.stdout.write("error: " + err.message);
 *          } else {
 *              process.stdout.write("user: " + obj.id);
 *          }
 *
 *      });
 * };
 * 
 *
 * 
 */


/*jshint node:true*/
/*jslint node:true, es5: true*/
'use strict';

var USER_TYPE = 'actor.user';
var GROUP_TYPE = 'actor.group';
var SYSYEM_TYPE = 'actor.system';
var GOD_USER = {
	id: 'god_user',
	rev: '0',
	type: 'actor.person',
	partition: '*',
	acl: {
		reders: {},
		writers: {}
	},
	obj: {
		login: 'god',
		password: 'god'
	}
};



/**
 * The constructor of IdentityManager
 * @constructor
 * @param {UnStore} unstore
 */
var IdentityManager = function (unstore) {
	this.unstore = unstore;
};

/**
 * Setup the UnStore with the required summaries
 * @param  {UnStore}   unstore
 * @param  {Function} callback
 */
IdentityManager.storeSetup = function (unstore, callback) {
	// a view to fetch users by login
	var summaryUser = {
		name: 'actor',
		types: ['actor'],
		columns: [
			{key: 'login', ordered: true},
			{key: 'password', ordered: false}
		]
	};
	unstore.summarySave(summaryUser, callback);
};

/**
 * Get a user by its id
 * @param  {string}   id
 * @param  {string}   tenant
 * @param  {Object}   readers
 * @param  {Function} callback
 */
IdentityManager.prototype.getUserById = function (id, tenant, readers, callback) {
	this.unstore.fetchByTypeId(USER_TYPE, id, tenant, readers, callback);
};

/**
 * Get an actor by its login
 * @param  {string}   login    the login of the actor
 * @param  {string}   tenant   the tenant of the actor 
 * @param  {Object}   readers  the readers in the ACL
 * @param  {Function} callback the function(err,obj) that will be called when the actor object is ready
 */
IdentityManager.prototype.getActor = function (login, tenant, readers, callback) {
	var me = this;
	this.unstore.summaryFetch('actor', {values: login, count: 1}, tenant, readers, function (err, summary) {
		if (err) {
			callback(err, summary);
		} else {
			if (summary.rows.length === 0) {
				callback(null, null);
			} else {
				me.unstore.fetchByTypeId(summary.rows[0].type, summary.rows[0].id, tenant, readers, callback);
			}
		}
	});
};

/**
 * Get an actor by its login and password
 * @param  {string}   login    the login of the actor
 * @param  {string}   password the password of the actor
 * @param  {string}   tenant   the tenant of the actor 
 * @param  {Object}   readers  the readers in the ACL
 * @param  {Function} callback the function(err,obj) that will be called when the actor object is ready
 */
IdentityManager.prototype.getActorPwd = function (login, password, tenant, readers, callback) {
	this.getActor(login, tenant, readers, function (err, actor) {
		if (err) {
			callback(err, actor);
		} else {
			if (actor && actor.obj.password === password) {
				callback(null, actor);
			} else {
				callback(null, null);
			}
		}
	});
};

/**
 * Create a new actor
 * @param  {Object}   actor    The actor DataObject
 * @param  {string}   type     The type of the DataObject (eg. actor.user)
 * @param  {string}   tenant   The tenant of the actor
 * @param  {Object}   writers  The writers ACL
 * @param  {Function} callback the function(err,obj) that will be called when the actor is saved
 */
IdentityManager.prototype.createActor = function (actor, type, tenant, writers, callback) {
	var dataObject = {
		type: type,
		partition: tenant,
		acl: {
			readers: writers,
			writers: writers
		},
		id: actor.login,
		obj: actor
	};
	this.unstore.dataObjectSave(dataObject, writers, callback);
};

IdentityManager.prototype.USER_TYPE = USER_TYPE;
IdentityManager.prototype.GROUP_TYPE = GROUP_TYPE;
IdentityManager.prototype.SYSYEM_TYPE = SYSYEM_TYPE;
IdentityManager.prototype.GOD_USER = GOD_USER;

/**
 * return an instance of an ItentityManager
 * @param  {UnStore}  unstore an UnStore instance or null/false to get the previous instantiated IdentityManager
 * @param  {Function} callback the callback called when the IdentityManager is initialized
 * @return {ItentityManager}
 */
exports.getInstance = function (unstore, callback) {
	if (unstore) {
		IdentityManager.instance = new IdentityManager(unstore);
		IdentityManager.storeSetup(unstore, callback);
	}
	return IdentityManager.instance;
};