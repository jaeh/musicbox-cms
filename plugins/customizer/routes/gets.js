"use strict";

/**
 *	Route to controllers.
 */

module.exports = function (app) {
    app.get('/customizer', app.plugins.customizer.controllers.gets.customizer);
};
