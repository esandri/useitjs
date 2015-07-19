/*global angular:true, browser:true */
'use strict';


// Declare app level module which depends on filters, and services
angular.module('unapp',
	[	'ngRoute',
		'http-auth-interceptor',
		'ui.bootstrap',
		'unapp.directives',
		'unapp.fields.ua',
		'unapp.fields.ua.text',
		'unapp.controllers',
		'unapp.formcontroller',
		'ngTagsInput'
	]).config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'Home'});
		$routeProvider.when('/do/:type', {templateUrl: 'partials/summary.html', controller: 'SummaryController'});
		$routeProvider.when('/do/:type/:id', {templateUrl: 'partials/doform.html', controller: 'FormController'});
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
