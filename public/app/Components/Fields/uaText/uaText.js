var module = angular.module('unapp.fields.ua.text',['unapp.services']);


module.directive('uaText', ['uaFieldsEngine', function(uaFieldsEngine) {
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '='
    	},
		templateUrl: './Components/Fields/uaText/uaText.html',
		link: function ($scope, element) {
			$scope.designmode = uaFieldsEngine.getDesignMode();
			/*if ($scope.designmode) {
				console.log(element);
				element.on('focus', function() {
					console.log('focus on');
				});
			}*/

			// TODO: add event listening for designmode 
			if ($scope.designmode) {
				$scope.onFocus = function () {
					uaFieldsEngine.setCurrentField($scope.field);
				};
			}
		}
	};
}]);