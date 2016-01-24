'use strict';

angular.module('unapp.formeditor').controller('FormEditor', ['$scope', 'formServices', function($scope, formServices) {
	$scope.formdata = formServices.getForm('form1');

	$scope.formdata.then(function(data) {
		$scope.formdata = data;
	});

	$scope.getFieldEditor = function(field) {
		return 'src/Field' + field.type + '/' + 'Field' + field.type + 'Editor.html';
	};
}]);

