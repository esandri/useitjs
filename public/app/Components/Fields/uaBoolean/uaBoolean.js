var module = angular.module('unapp.fields.ua.boolean',['unapp.services']);


module.directive('uaBoolean', ['uaFieldsEngine', function(uaFieldsEngine) {

	var form = [
		{"type":"text","id":"label","name":"label","label":"Label"},
		{"type":"text","id":"id","name":"id","label":"Id"},
		{"type":"text","id":"name","name":"name","label":"Name"},
		{"type":"text","id":"true_label","name":"true_label","label":"True label"},
		{"type":"text","id":"false_label","name":"flase_label","label":"False label"}
	];
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '=',
			designmode: '='
    	},
		templateUrl: './Components/Fields/uaBoolean/uaBoolean.html',
		link: function ($scope, element) {
			if ($scope.field.true_label === undefined) {
				$scope.field.true_label = 'Yes';
			}
			if ($scope.field.false_label === undefined) {
				$scope.field.false_label = 'No';
			}
			// TODO: add event listening for designmode 
			if ($scope.designmode) {
				$scope.onFocus = function () {
					uaFieldsEngine.setCurrentField($scope.field, form);
				};
			}
		}
	};
}]);