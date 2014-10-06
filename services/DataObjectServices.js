/**
 * DataObjectServices is the http/s services that addresses the DataObject management
 *
 * @module DataObjectServices
 */

/*jshint node: true*/
/*jslint node: true*/
'use strict';

/**
 * The constructor of the DataObjectServices
 * @constructor
 * @param {UnStore} unstore The unstore
 */
var DataObjectServices = function (unstore) {
	this.us = unstore;
};

/**
 * The service to respond to GET http method
 *
 * @description This services respond to http requests. This service responds to two
 *              kind of requests:
 *              - tenant/type/id: in this case the service resturn the 
 *                                  required DataObject
 *              - tenant/type: in this case the service terturn the list of 
 *                                  the DataOject(s) of the required type
 * 
 * @param  {Request} req  The http request. These must contains 
 *                        tenant, type, id
 * @param  {Response} res The service write the response on the 
 *                        res object (Express)
 * @return {Response} The result is written asincronously on 
 *                        the response http object
 */
DataObjectServices.prototype.doGet = function (req, res) {
	if (req.params.id) {
		if (req.params.id === 'new') {
			var dobj = {
				type: req.params.type,
				id: null,
				partition: req.params.tenant,
				acl: {
        			readers: req.session.names,
			        writers: req.session.names
			    },
			    obj: {}
			};
			res.send(dobj);
		} else {
			this.us.fetchByTypeId(req.params.type, req.params.id, req.params.tenant, req.session.names, function (err, dobj) {
				if (err) {
					if (err.error === 'not_found') {
						res.status(404);
					} else if (err.error === 'forbidden') {
						res.status(401);
					} else {
						res.status(err.status_code);
					}
					res.send({type: 'error', obj: err});
				} else {
					if (dobj) {
						res.send(dobj);
					} else {
						res.status(404);
						res.send({type: 'error', obj: {
							status: 'error',
							status_code: '404_notfound'
						}});
					}
				}
			});
		}
	} else {
		this.us.fetchAllByType(req.params.type, 0, 100, req.params.tenant, req.session.names, function (err, arrobj) {
			if (err) {
				res.status(err.status_code);
				res.send({type: 'error', obj: err});
			} else {
				res.send(arrobj);
			}
		});
	}

};

/**
 * The service to respond to POST http method
 *
 * @description This services respond to http POST requests. This service write 
 *              permanently the DataObject into the UnStore
 * 
 * @param  {Request}  req The request object (with DataObject in json format)
 * @param  {Response} res The response object (return the saved DataObject 
 *                        in json format)
 */
DataObjectServices.prototype.doPost = function (req, res) {
	process.stdout.write("POST ***** \n");
	this.us.dataObjectSave(req.body, req.session.names, function (err, dobj) {
		if (err) {
			res.status(err.status_code);
			res.send({type: 'error', obj: err});
		} else {
			res.send(dobj);
		}
	});
};

/**
 * This is an utility method to update a DataObject.
 * This method first try to get the object: if not found then create a new one,
 *  otherwise update the old one. 
 * @param  {DataObject} docNew   The DataObject to update
 * @param  {Object}     names    The ACL to use (normally the one present in session)
 * @param  {Function}   callback   The function that will be called at the end
 */
DataObjectServices.prototype.updateDoc = function (docNew, names, callback) {
    var me = this;
	this.us.fetchByTypeId(docNew.type, docNew.id, docNew.partition, names, function (err, doc) {
		if (err) {
			if (err.error === 'not_found') {
				doc = {rev: '0'};
			} else {
				callback(err, doc);
				return;
			}
		}

		if (doc.rev < docNew.rev) {
			me.us.dataObjectSave(docNew, names, callback);
		} else {
			callback(null, doc);
		}

	});
};

exports.DataObjectServices = DataObjectServices;