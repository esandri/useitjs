/*global angular:true, browser:true */
'use strict';

/* Filters */

angular.module('unapp.filters', []).
	filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}]);
