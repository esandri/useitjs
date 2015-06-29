
var module = angular.module('unapp.fields.1', ['ui.codemirror']);


module.directive('uaMultiFields', function() {
	return {
		scope: {
			field: '=',
			dataarray: '='
    	},
		templateUrl: './js/directives/fields/uaMultiFields/uaMultiFields.html',
		controller: function ($scope) {
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
});