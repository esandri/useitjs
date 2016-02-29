/*global angular:true, browser:true */
'use strict';

/* Directives */


angular.module('unapp.directives', [])
	.directive('appVersion', ['version', function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	}])
	.directive('unappApplication', function() {
		return {
			restrict: 'C',
			compile: function(scope, elem, attrs) {
				return {
					post: function(scope, elem, attrs) {

						//once Angular is started, remove class:
						elem.removeClass('waiting-for-angular');

						scope.afterDomLoad = function() {

							var login = elem.find('#login-holder');
							var main = elem.find('#content');

							login.hide();

							scope.$on('event:auth-loginRequired', function() {
								login.slideDown('slow', function() {
									main.hide();
								});
							});
							scope.$on('event:auth-loginConfirmed', function() {
								main.show();
								login.slideUp();
							});
						};
					}
				};
			}
		};
	});
