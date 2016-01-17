/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

var app = angular.module('unapp.controllers', ['http-auth-interceptor','unapp.services']);

app.controller( 'RootController', ['$scope', 'loginservice', function($scope, loginservice) {
	$scope.userInfo = loginservice.getInfo();
}]);

app.controller( 'NavBar', ['$scope', '$location', 'summary', 'loginservice', function($scope, $location, summary, loginservice) {

	$scope.viewList = summary.query({
		tenant: 'global',
		summaryname: 'views'
	});

	//$scope.user = loginservice.getInfo();

	$scope.vSelected = 'views';
	$scope.$watch("vSelected",function(){
		console.log('Selected: ' + $scope.vSelected);
		$location.path('/do/' + $scope.vSelected );
	});

	$scope.create = function (type) {
		$location.path('/do/' + type + '/new' );
	};
}]);


app.controller( 'LoginController', [ '$scope', 'loginservice', 'authService', function ($scope, loginservice, authService) {
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
}]);
