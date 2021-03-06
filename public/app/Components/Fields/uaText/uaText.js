var module = angular.module('unapp.fields.ua.text',['unapp.services']);


module.directive('uaText', ['uaFieldsEngine', function(uaFieldsEngine) {

	var form = [
		{"type":"text","id":"label","name":"label","label":"Label"},
		{"type":"text","id":"id","name":"id","label":"Id"},
		{"type":"text","id":"name","name":"name","label":"Name"}
	];
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '=',
			designmode: '='
    	},
		templateUrl: './Components/Fields/uaText/uaText.html',
		link: function ($scope, element) {

			// TODO: add event listening for designmode 
			//if ($scope.designmode) {
				$scope.pubProperties = function () {
					uaFieldsEngine.setCurrentField($scope.field, form);
				};
			//}
		}
	};
}]);