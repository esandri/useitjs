/*global angular:true, browser:true */
'use strict';

/* Directives */


angular.module('unapp.fields', ['ui.codemirror'])
	.directive('uaInputR', function() {
		return {
			restrict: 'C',
			replace: true,
			transclude: true,
			scope: { label:'@label' },
			template:	'<div class="control-group">' +
							'<label class="control-label" for="namefirst">{{label}}</label>' +
							'<div class="controls">' +
								'<span class="input-xlarge uneditable-input" ng-transclude></span>' +
							'</div>' +
						'</div>',
			};
	}).directive('uaAddressR', function() {
		return {
			restrict: 'C',
			replace: true,
			transclude: true,
			scope: { label:'@label' },
			template:	'<div class="control-group">' +
							'<label class="control-label" for="namefirst">{{label}}</label>' +
							'<div class="controls">' +
								'<address class="uneditable-input auto-height" ng-transclude></address>' +
							'</div>' +
						'</div>',
			};
	}).directive('uaInput', function() {
		return {
			restrict: 'C',
			replace: true,
			transclude: true,
			scope: {
				label:'@label',
				id:'@id',
				name:'@name',
				value: '@value'
			},
			template:	'<div class="control-group">' +
							'<label class="control-label" for="{{id}}">{{label}}</label>' +
							'<div class="controls">' +
								'<input type="text" class="input-xlarge" id="{{id}}" name="{{name}}" value="{{value}}" />' +
							'</div>' +
						'</div>',
			};
	}).directive('uaMultiFields', function($compile) {
		return {
			scope: {
				field: '=',
				dataarray: '='
			},
			link: function(scope, elem, attrs) {
				var elemContainer,
					html = '<div ua-form-fields fields="fields" data="data" class="bs-callout bs-callout-info {{field.class}} col-xs-12"></div>';


				var changefn = function(elem, newDataarray) {
					var oldElems = elem.children();

					var dindex = 0;
					for (; dindex < newDataarray.length; dindex = dindex + 1) {
						// prepare new scope
						var childscope = scope.$new();
						childscope.data = scope.dataarray[dindex];
						childscope.fields = scope.field.fields;

						// create new block element
						var blockfn = $compile(html);
						var newElem = blockfn(childscope);

						// try to get nth-dindex dom element in the collection
						if (dindex < oldElems.length ) {
							var jqElem = angular.element(oldElems[dindex]);
							jqElem.replaceWith(newElem);
						} else {
							elem.append(newElem); 
						}
					}
					// remove exceeding elements
					for (; dindex < oldElems.length-1; dindex = dindex + 1) {
						oldElems[dindex].remove();
					}

				};

				scope.$watch('dataarray', function(newDataarray, oldDataarray) {

					if (!scope.initialized) {
						elem.addClass('multi-control');
						var basefn = $compile('<span>{{field.label}}</span>' +
											 '<div id="multi-container-' + scope.field.id + '"></div>' +
											 '<button class="btn btn-primary" value="add" ng-click="addBlock()">add</button>');
						elem.append(basefn(scope));
						elemContainer = elem.find('div');
						//var domElem = document.getElementById('multi-container-' + scope.field.id);
						//elemContainer = angular.element(domElem);

						scope.initialized = true;
					}

					if (scope.dataarray && (scope.initialized || oldDataarray == null || newDataarray.length != oldDataarray.length)) {
						changefn(elemContainer, scope.dataarray);
					}
					/*if (!scope.initialized) {
						scope.initialized = true;
						var buttonfn = $compile('<button value="add" ng-click="addBlock()">add</button>');
						elem.append(buttonfn(scope));
					}*/
					
				}, true);
			},
			controller: function($scope, $element, $attrs) {
				$scope.addBlock = function() {
					if (!$scope.dataarray) {
						$scope.dataarray = [];
					}
					if ($scope.dataarray.length < $scope.field.max) {
						$scope.dataarray.push({});
					}
				};
			}
		};
	}).directive('uaFormFields', function($compile) {
		return {
			scope: {
				fields: '=',
				data: '='
			},
			link: function(scope, elem, attrs) {
				var buildfn = function(newFields, oldFields) {

					if (!scope.data) return;
					elem.empty();
					if (!newFields) return;

					var html;
					for(var findex = 0; findex < newFields.length; findex = findex + 1) {
						var field = newFields[findex];
						if (!angular.isObject(field)) continue;
						html = '';
						// some default
						field.fieldSize = field.fieldSize || 4;
						field.labelSize = field.labelSize || 2;
						field.groupSize = field.groupSize || 12;
						switch(field.type) {
							case 'multi':
								html += '<div ' +
										' ua-multi-fields ' +
										' field="field" ' +
										' dataarray="data[\'' + field.id + '\']">' +
										'</div>';
								if (scope.data[field.id] == null) {
									scope.data[field.id] = [];
								}
							break;
							case 'fields':
								html += '<div ' +
										' ua-form-fields ' +
										' fields="field.fields" ' +
										' data="data[\'' + field.id + '\']">' +
										'</div>';
							break;
							case 'code':
								html = '<div class="form-group col-xs-{{field.groupSize}}">';
								html += '<label class="control-label col-xs-{{field.labelSize}}" for="{{field.id}}">{{field.label}}</label>';
								html += '<div class="col-xs-{{field.fieldSize}} {{field.type}}-control {{field.class}}">';
								html += '<div ui-codemirror ' +
										' ui-codemirror-opts="jsCodeOptions"' +
										' id="{{field.id}}" ' +
										' class="form-control" ' +
										' ng-model="data[\'' + field.id + '\']"/>';
								html += '</div>'; // controls
								html += '</div>'; // control-group										
							break;
							case 'number':
								html = '<div class="form-group col-xs-{{field.groupSize}}">';
								html += '<label class="control-label col-xs-{{field.labelSize}}" for="{{field.id}}">{{field.label}}</label>';
								html += '<div class="col-xs-{{field.fieldSize}}  {{field.type}}-control {{field.class}}">';
								html += '<input ' +
										' type="number" ' +
										' class="form-control" ' +
										' id="{{field.id}}" ' +
										' name="{{field.name}}" ' +
										' ng-model="data[\'' + field.id + '\']" />';
								if (!angular.isNumber(scope.data[field.id])) {
									scope.data[field.id] = parseInt(scope.data[field.id]);
								}
								html += '</div>'; // controls
								html += '</div>'; // control-group
							break;							
							default: // text and error!
								html = '<div class="form-group col-xs-{{field.groupSize}}">';
								html += '<label class="control-label col-xs-{{field.labelSize}}" for="{{field.id}}">{{field.label}}</label>';
								html += '<div class="col-xs-{{field.fieldSize}} {{field.type}}-control {{field.class}}">';							
								html += '<input ' +
										' type="text" ' +
										' class="form-control" ' +
										' id="{{field.id}}" ' +
										' name="{{field.name}}" ' +
										' ng-model="data[\'' + field.id + '\']" />';
								html += '</div>'; // controls
								html += '</div>'; // control-group										
						}

						var childscope = scope.$new();
						childscope.field = field;
						childscope.data = scope.data;
						var linkfn = $compile(html);
						elem.append(linkfn(childscope));
					}
				};

				scope.$watch('fields', buildfn);
				//scope.$watch('data', function(event, data) {

				//});

				scope.$on('fieldchange', function(event, newFields, newData) {
					scope.fields = newFields;
					scope.data = newData;
					buildfn(scope.fields, null);
				});

			}
		};
	});
