var module = angular.module('unapp.fields.ua', ['ui.codemirror']);


module.directive('uaFields', function() {
	return {
		scope: {
			fields: '=',
			docdata: '='
    	},
		templateUrl: './Components/Fields/uaFields/uaFields.html',
		controller: function ($scope) {

			if ($scope.fields) {
				console.log($scope.fields.length);
			}
		}
	};
});


module.directive("bindField", function($compile, $timeout) {
	return {
		template: '<div ></div>',
		scope: {
			field: '=bindField'
		},
		link: function($scope, elem, attrs) {
			$scope.$on('fieldchange',function() {
				var strHtml = '<ua-' + $scope.field.type + ' field="field" docdata="docdata" />';
				// we want to use the scope OUTSIDE of this directive
				// (which itself is an isolate scope).
				var newElem = $compile(strHtml)($scope.$parent);
				elem.contents().remove();
				elem.append(newElem);
			});

			var strHtml = '<ua-' + $scope.field.type + ' field="field" docdata="docdata" />';
			// we want to use the scope OUTSIDE of this directive
			// (which itself is an isolate scope).
			var newElem = $compile(strHtml)($scope.$parent);
			elem.contents().remove();
			elem.append(newElem);


			// scope.$watch('field', function(value) {
			// 	if (!value) return;
			// 	var strHtml = '<ua-' + value.type + ' fields="field.fields" data="data[field.id]" />';
			// 	// we want to use the scope OUTSIDE of this directive
			// 	// (which itself is an isolate scope).
			// 	var newElem = $compile(strHtml)(scope.$parent);
			// 	elem.contents().remove();
			// 	elem.append(newElem);
			// });
			// scope.$watch('$parent.data', function(value) {
			// 	if (!value) return;
			// 	console.log(value);
			// });
    	}
	};
});