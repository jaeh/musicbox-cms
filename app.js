"use strict";
/*!
 *  mcms - dry kiss
 *
 *  @author Jascha Ehrenreich <jascha@jaeh.at>
 *  @created 28/02/2013 NZST
 */

/**
 *  Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    load = require('express-load'),
    cons = require('consolidate'),
    swig = require('swig'),
    stylus = require('stylus'),
    path = require('path'),
    configure = require(path.join(__dirname, 'lib', 'configure')),
    confKey = '',
    pluginKey = '',
    config = {},
    pluginConfig = require(path.join(__dirname, 'plugins', 'pluginConfig')),
    app = module.exports = express();

app.rootDir = __dirname;

configure.do(app); //this calls app.configure and adds middlewares


load('config').into(app);

//assigning settings from config
config = app.config[app.get('env')];

for (confKey in config) {
    if (config.hasOwnProperty(confKey)) {
        app.set(confKey, config[confKey]);
    }
}

pluginConfig.do(app);

load('controllers').into(app);

pluginConfig.load(app); //loads all controllers and routes for all plugins into app

load('routes').into(app);

//actually start the server
app.listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});
