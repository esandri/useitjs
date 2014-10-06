// This service implements initializations of all the storages
// 1. Session
// 2. Identity
// 3. Data
// 
// The manager read the configuration and create one unstore instance for
//	any storage configuration. See this self explanatory example
//		[
//			{
//				name: 'unSession',
//				type: 'couchdb',
//				params: {
//					host: 'localhost',
//					port: '5984',
//					ssl: false,
//					cache: false,
//					user: 'admin',
//					password: 'esan2000',
//					database: 'session'
//				}
//			},
//			{
//				name: 'unIdentity',
//				type: 'couchdb',
//				params: {
//					host: 'localhost',
//					port: '5984',
//					ssl: false,
//					cache: false,
//					user: 'admin',
//					password: 'esan2000',
//					database: 'identity'
//				}
//			},
//			{
//				name: 'unData',
//				type: 'couchdb',
//				params: {
//					host: 'localhost',
//					port: '5984',
//					ssl: false,
//					cache: false,
//					user: 'admin',
//					password: 'esan2000',
//					database: 'data'
//				}
//			}
//		]

var unstore = require('unodestore');
var async = require('async');

var StorageManager = function() {
	this.config = null;
	this.stores = {};
};

StorageManager.prototype.initialize = function(param, callback) {
	this.config = param;
	var me = this;
	var initFunc = function(storageconf, callback) {
		var store = new unstore.UnStore();
		store.setDriver(storageconf.type);
		store.openConnection(storageconf.params, callback);
		me.stores[storageconf.name] = store;
	};
	
	async.eachSeries(this.config, initFunc, callback);
};

StorageManager.prototype.getStorage = function(storagename) {
	return this.stores[storagename];
};

exports.getInstance = function(params, callback) {
	if (params) {
		StorageManager.instance = new StorageManager();
		StorageManager.instance.initialize(params, callback);
	}
	return StorageManager.instance;
};