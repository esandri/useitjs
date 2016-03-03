
var module = angular.module('unapp.fields.ua.multi', ['unapp.services']);


module.directive('uaMulti', ['uaFieldsEngine', function(uaFieldsEngine) {
	var form = [
		{"type":"text","id":"label","name":"label","label":"Label"},
		{"type":"text","id":"id","name":"id","label":"Id"},
		{"type":"text","id":"name","name":"name","label":"Name"},
		{"type":"number","id":"min","name":"min","label":"Min"},
		{"type":"number","id":"max","name":"max","label":"Max"}
	];
	return {
		scope: {
			field: '=',
			docdata: '=',
			designmode: '='
    	},
		templateUrl: './Components/Fields/uaMultiFields/uaMultiFields.html',
		controller: function ($scope) {
			
			if ($scope.field.min === undefined) {
				$scope.field.min = 0;
			}
			if ($scope.field.max === undefined) {
				$scope.field.max = 10;
			}
			if ($scope.field.fields === undefined) {
				$scope.field.fields = [];
			}
			$scope.addBlock = function() {
				if (!$scope.docdata[$scope.field.id]) {
					$scope.docdata[$scope.field.id] = [];
				}
				if ($scope.docdata[$scope.field.id].length < $scope.field.max) {
					$scope.docdata[$scope.field.id].push({});
				}
			};

			$scope.pubProperties = function () {
				uaFieldsEngine.setCurrentField($scope.field, form);		
			};
		}
	};
}]);