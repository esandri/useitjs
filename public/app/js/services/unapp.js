// socialaccounts.js

angular.module('unapp.services', ['ngResource']).
	factory('loginservice', function($resource) {
		return $resource('auth/:action', {}, {
			doLogin: {method:'POST', params: {action:'login'}},
			doLogout: {method:'GET', params: {action:'logout'}},
			doRegister: {method:'POST', params: {action:'register'}}
		});
	}).
	factory('dataobject', function($resource) {
		var dataobject = {};
		dataobject._cache = {};

		dataobject.resource = $resource('/dataobject/:tenant/:type/:id', {}, {
			'query':  {method:'GET', isArray:false}
		});

		dataobject.get = function(options) {
			if (options && options.cache) {
				var hash = options.tenant + '/' + options.type + '/' + options.id;
				if (this._cache[hash]) {
					return this._cache[hash];
				} else {
					this._cache[hash] = this.resource.get(options);
					return this._cache[hash];
				}
			} else {
				return this.resource.get(options);
			}
		};

		dataobject.save = function(object, cb) {
			return this.resource.save(object, cb);
		};

		return dataobject;
	}).
	factory('summary', function($resource) {
		return $resource('/summary/:tenant/:summaryname?start=:start&count=:count&values=:values', {}, {
			'query':  {method:'GET', isArray:false}
		});
	}).
	factory('view', function($summary, $dataobject) {
		var summary = {};
		summary.resourceData = $resource(
								'/summary/:tenant/:summaryname?start=:start&count=:count&values=:values', 
								{}, 
								{'query':  {method:'GET', isArray:false}}
		);

		summary.query = function(options) {
			return this.resourceData.query(options);
		};

		summary.getDesign = function(options) {
			return $dataobject.query({tenant: options.tenant, type: '_view', id: options.summaryname});
		};

		return summary;
	}).
	factory('summaryrows', function($http) {
		return {
			query: function(options) {
				var url = '/summary/' + options.tenant +
							'/' + options.summaryname +
							'?start=' + (options.start || '') +
							'&count=' + (options.count || '') +
							'&values=' + (options.values || '');
				return $http.get(url).then(function(response){
					return response.data.rows;
				});
			}
		};
	});