
var module = angular.module('unapp.fields.ua.multi', []);


module.directive('uaMulti', ['uaFieldsEngine', function(uaFieldsEngine) {
	return {
		scope: {
			field: '=',
			docdata: '='
    	},
		templateUrl: './Components/Fields/uaMultiFields/uaMultiFields.html',
		controller: function ($scope) {
			$scope.designmode = uaFieldsEngine.getDesignMode();
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

			if ($scope.designmode) {
				$scope.onClick = function () {
					console.log('focus angular on');
					uaFieldsEngine.setCurrentField($scope.field);		
				};
			}
		}
	};
}]);