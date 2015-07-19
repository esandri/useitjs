var module = angular.module('unapp.fields.1', ['ui.codemirror']);


module.directive('uaFormFields', function() {
	return {
		scope: {
			fields: '=',
			data: '=data'
    	},
		templateUrl: './fields/uaFormFields/uaFormFields.html',
		controller: function ($scope) {
		}
	};
});