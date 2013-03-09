"use strict";


var express = require('express'),
    load = require('express-load'),
    cons = require('consolidate'),
    swig = require('swig'),
    stylus = require('stylus'),
    path = require('path');

exports.do = function (app) {

    // Configuration
    app.configure(function () {

        var viewPath = path.join(app.rootDir, 'views');

        app.use(express.compress());

        app.set('views', viewPath); // template directory

        // NOTE: Swig requires some extra setup
        // This helps it know where to look for includes and parent templates
        swig.init({
            root        : viewPath,
            allowErrors : true // allows errors to be thrown and caught by express instead of suppressed by Swig
        //, filters: require('./ejsfilters')
        });

        app.engine('.html', cons.swig);

        app.set('view engine', 'html');

        app.use(express.logger('dev'));

        app.use(express.favicon(path.join(app.rootDir, 'public', 'img', 'favicon.ico')));

        app.use(stylus.middleware({
            replaceInStylusPath: {rm: '/css', add: ''},
            src: app.rootDir + '/views',
            dest: app.rootDir + '/public',
            compile: function (str, p) {
                return stylus(str)
                    .set('filename', p)
                    .set('compress', true);
                //.use(nib());
            }
        }));

        app.use(express.static(path.join(app.rootDir, 'public')));
        app.use(express.static(path.join(app.rootDir, 'views')));

        app.use(express.bodyParser());

        app.use(express.methodOverride());

        app.use(function (req, res, next) {
            res.locals.theme = app.get('themeMap')[req.host] || app.get('theme') || 'mcms';
            app.set('theme', res.locals.theme);
            console.log('getting theme for host = ' + req.host);
            console.log(app.get('themeMap')[req.host]);
            res.locals.themeRootFile = res.locals.theme + '/index.html';

            res.locals.config = require(path.join(app.rootDir, 'views', res.locals.theme, 'config'));

            next();
        });

        app.use(app.router);

    });


    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function () {
        app.use(express.errorHandler());
    });

    return true;
};
