/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

var appService = angular.module('unapp.loader',['angularLoad']);

appService.factory('loaderService', function(angularLoad) {
	var arrLoaded = {};
	var arrScript = {};
	var $injector = angular.injector();

	var loader = {
		loadFieldModule: function(moduleName) {
			if (arrLoaded[moduleName]) {
				//  this module is already loaded
				return arrLoaded[moduleName];
			}

			if (moduleName.substring(0, 1) === '.') {
				// load from filesystem
				arrLoaded[moduleName] = angularLoad.loadScript('js/directives/fields/' + moduleName + '.js');
				arrLoaded[moduleName].then(function() {
					arrLoaded[moduleName].injector = angular.injector([moduleName]);
				});
				return arrLoaded[moduleName];
			}
		},
		getModule: function(moduleName) {
			return arrLoaded[moduleName];
		},
		loadFieldScript: function(scriptName) {
			if (arrLoaded[moduleName]) {
				//  this module is already loaded
				return arrLoaded[moduleName];
			}

			if (moduleName.substring(0, 1) === '.') {
				// load from filesystem
				arrLoaded[moduleName] = angularLoad.loadScript('js/directives/fields/' + moduleName + '.js');
				arrLoaded[moduleName].then(function() {
					arrLoaded[moduleName].injector = angular.injector([moduleName]);
				});
				return arrLoaded[moduleName];
			}
		}
	};

	return loader;

});

appService.factory('fieldFactory', function(loaderService) {
	var fieldFactory = {
		getFieldFactory: function(fieldName) {
			var modField = fieldName.split('.');
			return loaderService.getModule(modField[0]).injector.get(modField[1]);
		}
	};

	return fieldFactory;

});