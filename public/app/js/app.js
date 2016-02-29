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
		'unapp.fields.ua.boolean',
		'unapp.fields.ua.number',
		'unapp.fields.ua.multi',
		'unapp.fields.ua.tagfield',
		'unapp.controllers',
		'unapp.controllers.summary',
		'unapp.dodocument',
		'unapp.document',
		'unapp.formeditor',
		'unapp.vieweditor',
		'ngTagsInput'
	]).config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/do/_form/:id', {templateUrl: 'partials/DoForm.html', controller: 'DoDocument'});
		$routeProvider.when('/do/_view/:id', {templateUrl: 'partials/DoView.html', controller: 'DoDocument'});
		$routeProvider.when('/do/:type', {templateUrl: 'partials/DoSummary.html', controller: 'DoSummary'});
		$routeProvider.when('/do/:type/:id', {templateUrl: 'partials/DoDocument.html', controller: 'DoDocument'});
		$routeProvider.otherwise({redirectTo: '/do/views'});
	}]);
