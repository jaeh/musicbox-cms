"use strict";

module.exports = function (app) {
    app.post('/contact', app.controllers.posts.formMiddleWare, app.controllers.posts.contact);
};
