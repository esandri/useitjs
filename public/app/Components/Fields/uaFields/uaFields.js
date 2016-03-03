var module = angular.module('unapp.fields.ua', ['ui.codemirror', 'unapp.services']);


module.directive('uaFields', ['uaFieldsEngine', function(uaFieldsEngine) {
	return {
		scope: {
			fields: '=',
			docdata: '=',
			designmode: '='
    	},
		templateUrl: './Components/Fields/uaFields/uaFields.html',
		controller: function ($scope) {
			//$scope.designmode = uaFieldsEngine.getDesignMode();
			console.log("fields :" + $scope.designmode);

			if ($scope.fields === undefined) {
				$scope.fields = [];
			}

			$scope.dataField = {
				type: ''
			};
			$scope.addField = function () {
				$scope.fields.push({
					"type": $scope.dataField.type,
					"id": "ID",
					"name": "NoName",
					"label": "NoLabel"
				});
			};
			$scope.onDesignPropClick = function ($event) {
				
				var element = $event.currentTarget.parentElement.parentElement.getElementsByClassName('fieldElement');
				var designElementScope = angular.element(element[0].firstChild.firstChild).scope();
				designElementScope.$evalAsync("pubProperties()");
				console.log('--');
			};
			$scope.onDesignTrashClick = function ($index, $event) {
				$scope.fields.splice($index,1);
			};
		}
	};
}]);


module.directive("bindField", function($compile, $timeout, uaFieldsEngine) {
	return {
		template: '<div ></div>',
		scope: {
			field: '=bindField',
			designmode: '='
		},
		link: function($scope, elem, attrs) {
			$scope.$on('fieldchange',function() {
				var strHtml = uaFieldsEngine.getFieldTag($scope.field.type); //'<ua-' + $scope.field.type + ' field="field" docdata="docdata" />';
				// we want to use the scope OUTSIDE of this directive
				// (which itself is an isolate scope).
				var newElem = $compile(strHtml)($scope.$parent);
				elem.contents().remove();
				elem.append(newElem);
			});

			console.log("bindField :" + $scope.designmode);
			var strHtml = uaFieldsEngine.getFieldTag($scope.field.type);
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