// socialaccounts.js

angular.module('unapp.services', ['ngResource']).
	factory('loginservice', function($resource) {
		var res = $resource('auth/:action', {}, {
			doLogin: {method:'POST', params: {action:'login'}},
			doLogout: {method:'GET', params: {action:'logout'}},
			doRegister: {method:'POST', params: {action:'register'}},
			_getInfo: {method: 'GET', params: {action:'info'}}
		});

		res.userInfo = null;
		res.getInfo = function (params) {
			if (!res.userInfo) {
				console.info('load userInfo from server');
				res.userInfo = res._getInfo(params);
			}
			return res.userInfo;
		};
 
		return res;
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
			// update cache
			var hash = object.tenant + '/' + object.type + '/' + object.id;
			if (this._cache[hash]) {
				this._cache[hash] = object;
			}
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
	}).
	factory('uaFieldsEngine', function () {
		var fieldMap = {
			'tagfield-no': '<tags-input ng-model="docdata[field.id]" designMode="designMode">'
		};
		var designMode = false,
			currentField = {};
		return {
			getFieldTag: function (/*string*/ fieldType) {
				if (fieldMap[fieldType]) {
					return fieldMap[fieldType];
				} else {
					return '<ua-' + fieldType + ' field="field" docdata="docdata" designMode="designMode"/>';
				}
			},
			getDesignMode: function () {
				return designMode;
			},
			setDesignMode: function (dm) {
				designMode = dm;
			},
			getCurrentField: function () {
				return currentField;
			},
			setCurrentField: function (field) {
				currentField.field = field;
			}
		};
	});