"use strict";

/**
 *	Route to controllers.
 */


module.exports = function (app) {

    app.get('/', app.controllers.gets.index);

    app.get('/404', app.controllers.gets.fourofour);

    app.get('/:page', app.controllers.gets.page);
};
