var module = angular.module('unapp.fields.ua.text',[]);


module.directive('uaText', function() {
	return {
		restrict: 'E',
		scope: {
			//data: '=',
			field: '='
    	},
		templateUrl: './fields/uaText/uaText.html',
		controller: function ($scope) {
			if ($scope.data) {
				console.log($scope.data[field.id]);
			}
		}
	};
});