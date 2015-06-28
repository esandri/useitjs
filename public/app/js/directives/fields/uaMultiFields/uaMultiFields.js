
var module = angular.module('unapp.fields.1', ['ui.codemirror']);


module.directive('uaMultiFields', function() {
	return {
		scope: {
			field: '=',
			dataarray: '='
    	},
		templateUrl: './js/directives/fields/uaMultiFields/uaMultiFields.html'
	};
});