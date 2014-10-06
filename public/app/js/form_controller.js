/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

angular.module('unapp.formcontroller', ['ngRoute','http-auth-interceptor','unapp.services']);


var FormController = function($scope, summaryrows, dataobject, $routeParams, $http) {
	$scope.dataobject = dataobject.get({tenant: 'testpartition', type: $routeParams.type, id: $routeParams.id});
	$scope.form = dataobject.get({tenant: 'testpartition', type: '_form', id: $routeParams.type, cache: true});

	$scope.dataobject.$promise.then(function(){
		if ($scope.form.$resolved) {
			$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
		}
	});

	$scope.form.$promise.then(function(){
		if ($scope.dataobject.$resolved) {
			$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
		}
	});

	$scope.back = function() {
		history.back();
	};

	$scope.save = function() {
		if (!$scope.dataobject.id) {
			if (angular.isString($scope.form.obj.setId)) {
				var fnSetId = new Function($scope.form.obj.setId);
				$scope.dataobject.id = fnSetId.apply($scope.dataobject.obj, $scope.dataobject);
			} else {
				$scope.dataobject.id = '' + Math.floor((Math.random() * 1000000000) + 1);
			}
		}
		dataobject.save($scope.dataobject, function(data) {
			console.log('saved dataobject: ' + JSON.stringify(data));
			$scope.dataobject = ulib.copyTo($scope.dataobject, data);
		});
		/*$scope.dataobject.$save(function(data) {

			$scope.$broadcast('datachange', $scope.dataobject.obj);
			
		});*/
		// force change to form to rebuild all the form
	};

	$scope.jsCodeOptions = {
		mode: 'javascript'
	};
};