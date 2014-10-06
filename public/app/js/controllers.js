/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

angular.module('unapp.controllers', ['http-auth-interceptor','unapp.services']);

var Home = function($scope, $location) {

};

var NavBar = function($scope, $location, summary) {

	$scope.viewList = summary.query({
		tenant: 'global',
		summaryname: 'views'
	});


	$scope.vSelected = 'views';
	$scope.$watch("vSelected",function(){
		console.log('Selected: ' + $scope.vSelected);
		$location.path('/do/' + $scope.vSelected );
	});

	$scope.create = function (type) {
		$location.path('/do/' + type + '/new' );
	};
};


var LoginController = function ($scope, loginservice, authService) {
	$scope.doLogin = function() {
		loginservice.doLogin(
			{
				username: $scope.username,
				password: $scope.password,
				tenant: $scope.tenant
			},
			function(obj) {
				console.log(obj);
				authService.loginConfirmed();
			},
			function(err) {
				console.log(err);
			}
		);
	};
	$scope.doRegister = function() {
		console.log('start registration');
		loginservice.doRegister(
			{
				username: $scope.username,
				password: $scope.password,
				tenant: $scope.tenant
			},
			function(obj) {
				console.log(obj);
			},
			function(err) {
				console.log(err);
			}
		);
	};

	$scope.doLogout = function() {
		loginservice.doLogout();
	};
};
