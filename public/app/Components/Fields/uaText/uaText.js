var module = angular.module('unapp.fields.ua.text',[]);


module.directive('uaText', function() {
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '='
    	},
		templateUrl: './Components/Fields/uaText/uaText.html',
		controller: function ($scope) {
			if ($scope.docdata) {
				console.log($scope.docdata[$scope.field.id]);
			}
		}
	};
});