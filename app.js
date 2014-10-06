// app.js
/* jshint laxcomma: true */
/*jslint node: true, es5:true*/
'use strict';

var defaultPort = 8888;




var config = require('./config.json');
var async = require('async');
var storageService = require('./services/StorageManager');
var identityService = require('./services/IdentityManager');
var unDataSetupService = require('./services/UnDataSetup');
var dos = require('./services/DataObjectServices');
var ss = require('./services/SummaryServices');

var storageManager = null;
var identityManager = null;


/////////////////////////////////////////////////////////////////
// Async initialization of storage
/////////////////////////////////////////////////////////////////

async.series([
    function (nextfunction) {
        process.stdout.write(" ********************************************* \n");
        process.stdout.write(" *** UnApp is initializing Storage Manager *** \n");
        process.stdout.write(" ********************************************* \n");
        storageManager = storageService.getInstance(config.storages, nextfunction);
    },
    function (nextfunction) {
        process.stdout.write(" ********************************************** \n");
        process.stdout.write(" *** UnApp is initializing Identity Manager *** \n");
        process.stdout.write(" ********************************************** \n");
        identityManager = identityService.getInstance(storageManager.getStorage('unIdentity'), nextfunction);
    },
    function (nextfunction) {
        process.stdout.write(" ********************************************** \n");
        process.stdout.write(" *** UnApp is initializing UnData Base Forms*** \n");
        process.stdout.write(" ********************************************** \n");
        unDataSetupService.initilizeForms(storageManager.getStorage('unData'), require('./base-forms.json'), nextfunction);
    },
    function (nextfunction) {
        process.stdout.write(" ********************************************** \n");
        process.stdout.write(" *** UnApp is initializing UnData Base Views*** \n");
        process.stdout.write(" ********************************************** \n");
        unDataSetupService.initilizeViews(storageManager.getStorage('unData'), require('./base-views.json'), nextfunction);
    }
],
    function (err, results) {
        if (err) {
            console.log(err);
        } else {
            /////////////////////////////////////////////////////////////////
            // Init app
            /////////////////////////////////////////////////////////////////

            var dataObjectService = new dos.DataObjectServices(storageManager.getStorage('unData')),
                summaryService = new ss.SummaryServices(storageManager.getStorage('unData')),

                express = require('express'),
                UnstoreStore = require('./services/UnstoreStore')(express),
                app = express(),
                AuthManager = null,
                auth = null;

            // coockie parser => req.coockies
            app.use(express.cookieParser());
            //app.use(express.session({secret: 'someunsecuresecret'}));
            // session manager
            app.use(express.session({
                secret: 'lalalalalala',
                store: new UnstoreStore({
                    unstore: storageManager.getStorage('unSession'),
                    sessname: 'unapp',
                    ttl: 3600
                })
            }));

            // parse http body => req.body is a json when it'is
            app.use(express.bodyParser());

            // publish static contents
            app.use(express.static('public/app'));

            /////////////////////////// LOGIN/LOGOUT /////////////////////////
            AuthManager = require('./services/AuthManager')();
            auth = new AuthManager({ im: identityManager});

            app.post('/auth/login', function (req, res) {
                auth.login(req, res);
            });
            app.get('/auth/logout', function (req, res) {
                auth.logout(req, res);
            });
            // register a new user - auto registration
            app.post('/auth/register', function (req, res) {
                auth.register(req, res);
            });
            //
            app.get('/*', function (req, res, next) {
                if (auth.isLoggedIn(req)) {
                    next();
                } else {
                    res.send(401, 'Unauthorized');
                }
            });


            /////////////////////////// ROUTING //////////////////////////////
            app.get('/dataobject/:tenant/:type', function (req, res) {
                dataObjectService.doGet(req, res);
            });
            app.get('/dataobject/:tenant/:type/:id', function (req, res) {
                dataObjectService.doGet(req, res);
            });
            app.post('/dataobject', function (req, res) {
                dataObjectService.doPost(req, res);
            });


            app.get('/summary/:tenant/:summaryname*', function (req, res) {
                req.session.lastdate = new Date();
                summaryService.doGet(req, res);
            });
            app.get('/summaryrows/:tenant/:summaryname*', function (req, res) {
                req.session.lastdate = new Date();
                summaryService.doGet(req, res, true);
            });

            ///////////// START LISTENING //////////////////////////////////
            app.listen(defaultPort);
            process.stdout.write("UnApp is listening on port: " + defaultPort + "\n");


        }
    });
