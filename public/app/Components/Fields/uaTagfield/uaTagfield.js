var module = angular.module('unapp.fields.ua.tagfield',[]);


module.directive('uaTagfield', function() {
	return {
		restrict: 'E',
		scope: {
			docdata: '=',
			field: '='
    	},
		templateUrl: './Components/Fields/uaTagfield/uaTagfield.html',
		controller: function ($scope) {
			if ($scope.docdata) {
				console.log($scope.docdata[$scope.field.id]);
			}
		}
	};
});