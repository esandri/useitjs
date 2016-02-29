
var module = angular.module('unapp.dodocument', ['ngRoute','unapp.services']);

module.controller( 'DoDocument', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.documentType=$routeParams.type;
	$scope.documentId=$routeParams.id;
}]);
