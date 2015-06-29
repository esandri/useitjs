/*jshint browser:true */
/*global angular: false, console:false*/
'use strict';

/* Controllers */

var SummaryController = function($scope, dataobject, summary, $routeParams, $location) {
	$scope.params = $routeParams;
	$scope.type = $routeParams.type;
	$scope.currPage = $routeParams.p || 1;
	$scope.maxPaginator = 5;
	$scope.totItems = undefined;
	$scope.pageCount = undefined;
	$scope.pxpage = 15;

	$scope.getClass = function(index) {
		return 'column-' + index;
	};

	$scope.newDocument = function() {
		$location.path('/do/' + $scope.view.obj.types[0] + '/new' );
	};

	var setScope = function() {
		$scope.currPage = $scope.list.query.start/$scope.pxpage+1;
		$scope.totItems = $scope.list.total;
		$scope.pageCount = $scope.list.total/$scope.pxpage;
		$scope.$watch('currPage', function(newPage) {
			$location.search('p=' + newPage);
		});
	};				

	var loadView = function() {
		$scope.list = summary.query({
				tenant: $scope.userInfo.tenant,
				summaryname: $scope.type,
				start: ($scope.currPage-1)*$scope.pxpage,
				count: $scope.pxpage
			});

		$scope.view = dataobject.get({tenant: $scope.userInfo.tenant, type: '_view', id: $scope.type, cache: true});

		$scope.list.$promise.then(function(){
			if ($scope.view.$resolved) {
				setScope();
			}
		});
		$scope.view.$promise.then(function(){
			if ($scope.list.$resolved) {
				setScope();
			}
		});
	}

	loadView();

};