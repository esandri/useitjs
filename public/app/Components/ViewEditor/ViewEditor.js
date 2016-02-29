/*jshint browser:true */
/*global angular:false, console:false, ulib:false*/
'use strict';

var module = angular.module('unapp.vieweditor', ['unapp.services']);


module.directive( 'uaVieweditor', 
	function() {

		return {
			scope: {
				id: '=uaId'  // the id of the view
			},
			templateUrl: 'Components/ViewEditor/ViewEditor.html',
			controller: ['$scope','view','loginservice', function ($scope, view, loginservice ) {


				var dobj = {};
				$scope.ready = false;

				$scope.propertiesColumn = {};

				$scope.userInfo = loginservice.getInfo();
				$scope.userInfo.$promise.then(function() {

					// if the page is called with a dataobject id, then we try to load the dataobject
					if ($scope.id != 'new') {
						dobj = view.getDesign({tenant: $scope.userInfo.tenant, summaryname: $scope.id});		
						dobj.$promise.then(function (){
							startProcessingView();
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
						startProcessingView();
					}

				});				


				var startProcessingView = function() {
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
					view.saveDesign($scope.dataobject, function(data) {
						console.log('saved dataobject: ' + JSON.stringify(data));
						$scope.dataobject = ulib.copyTo($scope.dataobject, data);
					});
					// force change to form to rebuild all the form
				};

				$scope.addColumn = function() {
					var col = {
						type: 'text',
						id: 'newid',
						key: 'newkey',
						label: 'newlabel',
						value: 'doc.obj.newvalue'
					};
					$scope.dataobject.obj.columns.push(col);
				};

				$scope.selectColumn = function(col) {
					$scope.propertiesColumn.currCol = col;
				};

				$scope.jsCodeOptions = {
					mode: 'javascript'
				};

				////////////////// properties
				$scope.propertiesColumn.currCol = {};
				$scope.propertiesColumn.fields = [
					{"type":"text","id":"type","name":"type","label":"Type"},
					{"type":"text","id":"id","name":"id","label":"Id"},
					{"type":"text","id":"key","name":"key","label":"Key"},
					{"type":"boolean","id":"ordered","name":"ordered","label":"Ordered"},
					{"type":"text","id":"label","name":"label","label":"Label"},
					{"type":"text","id":"value","name":"value","label":"Value"}
				];
			}]
		};
	}

);