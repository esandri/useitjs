var module = angular.module('unapp.fields.ua.tagfield',['unapp.services']);


module.directive('uaTagfield', ['uaFieldsEngine', function(uaFieldsEngine) {
	var form = [
		{"type":"text","id":"label","name":"label","label":"Label"},
		{"type":"text","id":"id","name":"id","label":"Id"},
		{"type":"text","id":"name","name":"name","label":"Name"},
		{"type":"text","id":"placeholder","name":"placeholder","label":"Placeholder"}
	];
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '=',
			designmode: '='
    	},
		templateUrl: './Components/Fields/uaTagfield/uaTagfield.html',
		link: function ($scope) {
			if ($scope.designmode) {
				$scope.onFocus = function () {
					uaFieldsEngine.setCurrentField($scope.field, form);
				};
			}
		}
	};
}]);