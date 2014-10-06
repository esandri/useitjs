// SummaryServices.js
/*jshint node: true*/

var SummaryServices = function(unstore) {
	this.us = unstore;
};

SummaryServices.prototype.doGet = function(req, res, wantArray) {
	// summaryname, query, partition, readers, callback
	var tenant = /*(req.params.tenant === 'global')?'global':*/req.session.tenant;
	console.log('SummaryServices.doGet: summaryname:' + req.params.summaryname + ', tenant: ' + tenant);
	onlyrows = wantArray || false;
	this.us.summaryFetch(
		req.params.summaryname,
		{
			start: req.query.start || 0,
			count: req.query.count || 25,
			values: req.query.values || null
		},
		tenant,
		req.session.names,
		function(err, obj) {
			if (err) {
				res.status(err.status_code);
				res.send({type: 'error', obj: err});
			} else {
				if (onlyrows) {
					res.send(obj.rows);
				} else {
					res.send(obj);
				}
			}
		}
	);
};

SummaryServices.prototype.updateView = function(docView, names, callback) {
	this.us.fetchByTypeId('_view', docView.id, docView.partition, names, function(err, doc) {
		if (err) {
			if (err.error === 'not_found') {
				doc = {};
			} else {
				callback(err,doc);
			}
		} else {
			if (doc.rev < docView.rev) {
				this.saveView(docView, names, callback);
			} else {
				callback(null, doc);
			}
		}
	});
};

SummaryServices.prototype.saveView = function(doc, names, callback) {
	// second: save summary
	this.us.dataObjectSave(doc,names,function(err,obj) {
		if (err) {
			callback(err,obj);
		} else {
			// second: save summary
			us.summarySave(doc.obj, callback);
		}
	});
};

SummaryServices.prototype.doSaveView = function(req, res) {
	this.saveView(this.us, req.body, req.session.names, function(err,obj){
		if (err) {
			res.status(err.status_code);
			res.send({type: 'error', obj: err});
		} else {
			res.send(obj);
		}		
	});
};

exports.SummaryServices = SummaryServices;