"use strict";

/**
 * handles all get requests. 
*/

var fs = require('fs'),
    path = require('path'),
    form = require('express-form'),
    field = form.field;

exports.index = function (req, res) {
    res.render(req.app.get('theme') + '/pages/home');
};

exports.page = function (req, res) {
    var templateFile = path.join(req.app.get('views'), req.app.get('theme'), 'pages', req.params.page + '.html');

    console.log('loading templateFile = ' + templateFile);
    fs.exists(templateFile, function (exists) {
        if (!exists) {
            res.redirect('404');
        } else {
            res.render(req.app.get('theme') + '/pages/' + req.params.page);
        }
    });
};

exports.fourofour = function (req, res) {
    res.render(req.app.get('theme') + '/pages/fourofour', function (err, page) {
        res.send(page, 404);
    });
};
