"use strict";

/**
 *	Route to controllers.
 */

module.exports = function (app) {
    app.get('/blog', app.plugins.blog.controllers.gets.postList);

    app.get('/blog/:post', app.plugins.blog.controllers.gets.post);
};
