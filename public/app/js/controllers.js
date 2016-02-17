/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

var app = angular.module('unapp.controllers', ['http-auth-interceptor','unapp.services']);

app.controller( 'RootController', ['$scope', 'loginservice', function($scope, loginservice) {
	$scope.userInfo = loginservice.getInfo();
}]);

app.controller( 'NavBar', ['$scope', '$location', 'summary', 'loginservice', function($scope, $location, summary, loginservice) {

	$scope.user = loginservice.getInfo();
	$scope.user.$promise.then(function() {
		$scope.viewList = summary.query({
			tenant: $scope.user.tenant,
			summaryname: 'views'
		});
		$scope.viewList.$promise.then(function () {
			var i = $scope.viewList.rows.length;
			while(i--) {
				if ($scope.viewList.rows[i].id === 'forms' || $scope.viewList.rows[i].id === 'types' || $scope.viewList.rows[i].id === 'views') {
					$scope.viewList.rows.splice(i,1);
				}
			}
		});
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
