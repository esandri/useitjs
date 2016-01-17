
var module = angular.module('unapp.fields.ua.multi', []);


module.directive('uaMulti', function() {
	return {
		scope: {
			field: '=',
			docdata: '='
    	},
		templateUrl: './fields/uaMultiFields/uaMultiFields.html',
		controller: function ($scope) {
			$scope.addBlock = function() {
				if (!$scope.docdata[$scope.field.id]) {
					$scope.docdata[$scope.field.id] = [];
				}
				if ($scope.docdata[$scope.field.id].length < $scope.field.max) {
					$scope.docdata[$scope.field.id].push({});
				}
			};			
		}
	};
});