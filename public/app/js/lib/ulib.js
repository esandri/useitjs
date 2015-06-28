// javascript utility functions

var ulib = {
	customFields: {},

	addCustomField: function (customFieldName, customFieldFactory) {
		this.customFields[customFieldName] = customFieldFactory;
	},

	getCustomField: function (name) {
		return this.customFields[name];
	},

	copyTo: function (v1, v2) {
		// deep copy of values of o1 to o2
		if (v1 instanceof Array) {
			v1 = ulib._copyArrayTo(v1, v2);
		} else if (v1 instanceof Object) {
			v1 = ulib._copyObjectTo(v1, v2);
		} else {
			v1 = ulib._copyScalarTo(v1, v2);
		}
		return v1;
	},

	_copyObjectTo: function (o1, o2) {
		var toKeep = {};
		for (var k in o2) {
			toKeep[k] = true;
			if (o1[k]) {
				o1[k] = ulib.copyTo(o1[k], o2[k]);
			} else {
				o1[k] = o2[k];
			}
		}
		for (var k in o1) {
			if (!toKeep[k]) {
				delete o1[k];
			}
		}
		return o1;
	},

	_copyArrayTo: function (a1, a2) {
		var i = 0;
		for (; i < a2.length; i = i + 1) {
			if (i < a1.length) {
				a1[i] = ulib.copyTo(a1[i], a2[i]);
			} else {
				a1.push(a2[i]);
			}
		}
		for (var j = a1.length-1; j >= i; j = j - 1) {
			delete a1[j];
		}
		return a1;
	},

	_copyDateTo: function (d1, d2) {
		d1.setTime(d2.getTime);
		return d1;
	},

	_copyScalarTo: function (s1, s2) {
		s1 = s2;
		return s2;
	}
};