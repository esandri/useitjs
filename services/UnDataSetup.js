// UnDataSetup.js
/*jshint node: true*/

var async = require('async');

exports.initilizeForms = function(us, formsFile, callback) {
	var jsonConf;
	if (typeof(formsFile) === 'string') {
		jsonConf = require(formsFile);
	} else {
		jsonConf = formsFile;
	}

	var initForm = function(formConf, callback) {
		delete formConf._comment;
		us.dataObjectUpdate(formConf, 'GOD', callback);
	};

	async.eachSeries(jsonConf, initForm, callback);
};

exports.initilizeViews = function(us, viewsFile, callback) {
	var jsonConf;
	if (typeof(viewsFile) === 'string') {
		jsonConf = require(viewsFile);
	} else {
		jsonConf = viewsFile;
	}

	var initView = function(viewConf, callback) {
		delete viewConf._comment;
		us.dataObjectUpdate(viewConf, 'GOD', function(err,obj){
			if (err) {
				callback(err,obj);
			} else {
				us.summarySave(viewConf.obj, callback);
			}
		});
	};

	async.eachSeries(jsonConf, initView, callback);
};