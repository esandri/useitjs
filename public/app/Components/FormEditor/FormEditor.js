/*jshint browser:true */
/*global angular:false, console:false, ulib:false*/
'use strict';

var module = angular.module('unapp.formeditor', ['unapp.services']);


module.directive( 'uaFormeditor', 
	function() {

		return {
			scope: {
				id: '=uaId'  // the id of the form
			},
			templateUrl: 'Components/FormEditor/FormEditor.html',
			controller: ['$scope','dataobject','loginservice','uaFieldsEngine', function ($scope, dataobject, loginservice, uaFieldsEngine ) {


				var dobj = {};
				$scope.ready = false;
				$scope.currentField = uaFieldsEngine.getCurrentField();
				uaFieldsEngine.setDesignMode( true );

				$scope.userInfo = loginservice.getInfo();
				$scope.userInfo.$promise.then(function() {

					// if the page is called with a dataobject id, then we try to load the dataobject
					if ($scope.id != 'new') {
						dobj = dataobject.get({tenant: $scope.userInfo.tenant, type: '_form', id: $scope.id});		
						dobj.$promise.then(function (){
							startProcessingForm();
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
						startProcessingForm();
					}

				});				


				var startProcessingForm = function() {
					if (dobj.$resolved) {
						var resolved = true;
						if (dobj.modules) {
							angular.forEach(dobj.modules, function(module) {
								if (!module.$resolved) {
									resolved = false;
								}
							});
						}
						if (resolved) {
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
						$scope.dataobject.id = '' + Math.floor((Math.random() * 1000000000) + 1);
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