/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

var module = angular.module('unapp.document', ['unapp.services']);


module.directive( 'uaDocument', 
	function() {

		return {
			scope: {
				type: '=uaType',
				id: '=uaId'
			},
			templateUrl: 'Components/Document/Document.html',
			controller: ['$scope','dataobject','loginservice', function ($scope, dataobject, loginservice ) {


				var form = {}, dobj = {};
				$scope.ready = false;

				$scope.userInfo = loginservice.getInfo();
				$scope.userInfo.$promise.then(function() {

					// load the form 
					form = dataobject.get({tenant: $scope.userInfo.tenant, type: '_form', id: $scope.type, cache: true});

					form.$promise.then( function (){
						// check for required special modules
						if (form.modules) {
							angular.forEach(form.modules, function (module, moduleName, modules) {
								// modules[moduleName] = loaderService.loadModule(moduleName);
							});
						}

						if (dobj.$resolved) {
							startProcessingForm();
						}
					});

					// if the page is called with a dataobject id, then we try to load the dataobject
					if ($scope.id != 'new') {
						dobj = dataobject.get({tenant: $scope.userInfo.tenant, type: $scope.type, id: $scope.id});		
						dobj.$promise.then(function (){
							if (form.$resolved) {
								startProcessingForm();
							}
						});
					} else {
						// the required id is 'new' => create an empty dataobject
						dobj = {
							$resolved: true,
							obj: {},
							type: $scope.type,
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
						}
					}

				});				


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
						}
					}
				};



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
					// force change to form to rebuild all the form
				};

				$scope.jsCodeOptions = {
					mode: 'javascript'
				};
			}]
		};
	}

);