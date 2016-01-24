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
		'unapp.fields.ua.multi',
		'unapp.controllers',
		'unapp.controllers.summary',
		'unapp.dodocument',
		'unapp.document',
		'ngTagsInput'
	]).config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/do/:type', {templateUrl: 'partials/summary.html', controller: 'SummaryController'});
		$routeProvider.when('/do/:type/:id', {templateUrl: 'partials/DoDocument.html', controller: 'DoDocument'});
		$routeProvider.otherwise({redirectTo: '/do/views'});
	}]);
