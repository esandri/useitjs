/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

var module = angular.module('unapp.formcontroller', ['ngRoute','http-auth-interceptor','unapp.services']);


module.controller( 'FormController', ['$scope', 'summaryrows', 'dataobject', '$routeParams', '$http',  function($scope, summaryrows, dataobject, $routeParams, $http) {

	var form = {}, dobj = {}
	$scope.ready = false;;


	var startProcessingForm = function() {
		if (form.$resolved && dobj.$resolved) {
			var resolved = true;
			if (form.modules) {
				angular.forEach(form.modules, function(module) {
					if (!module.$resolved) {
						resolved = false;
					}
				});
			}
			if (resolved) {
				$scope.form = form;
				$scope.dataobject = dobj;
				$scope.ready = true;
				$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
			}
		}
	}

	// load the form 
	form = dataobject.get({tenant: $scope.userInfo.tenant, type: '_form', id: $routeParams.type, cache: true});

	form.$promise.then(function(){
		// check for required special modules
		/*if ($scope.form.modules) {
			angular.forEach($scope.form.modules,function(module, moduleName, modules) {
				modules[moduleName] = loaderService.loadModule(moduleName);
			});
		}*/

		if (dobj.$resolved) {
			startProcessingForm();
			//$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
		}
	});

	// if the page is called with a dataobject id, then we try to load the dataobject
	if ($routeParams.id != 'new') {
		dobj = dataobject.get({tenant: $scope.userInfo.tenant, type: $routeParams.type, id: $routeParams.id});		
		dobj.$promise.then(function(){
			if (form.$resolved) {
				startProcessingForm();
				//$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
			}
		});
	} else {
		// the required id is 'new' => create an empty dataobject
		dobj = {
			$resolved: true,
			obj: {},
			type: $routeParams.type,
			acl: {
				readers: {},
				writers: {}
			},
			partition: $scope.userInfo.tenant
		};
		dobj.acl.readers[$scope.userInfo.login] = $scope.userInfo.login;
		dobj.acl.writers[$scope.userInfo.login] = $scope.userInfo.login;
		if (form.$resolved) {
			startProcessingForm();
			//$scope.$broadcast('fieldchange', $scope.form.obj.fields, $scope.dataobject.obj);
		}
	}

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
}]);