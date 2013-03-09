"use strict";

var fs = require('fs'),
    path = require('path'),
    load = require('express-load');

module.exports = {
    do: function (app) {
        var pluginRoot = path.join(app.rootDir, 'plugins');

        app.set('pluginRoot', pluginRoot);

        app.set('pluginDirs', fs.readdirSync(pluginRoot));
    },

    load: function (app) {
        var pluginDirs = app.get('pluginDirs'),
            pluginIdx = '';

        for (pluginIdx in pluginDirs) {
            if (pluginDirs.hasOwnProperty(pluginIdx)) {
                var p = path.join('plugins', pluginDirs[pluginIdx]);

                if (fs.existsSync(p)) {
                    load(path.join(p, 'controllers'))
                        .then(path.join(p, 'routes'))
                        .into(app);
                }
            }
        }
    }
};
