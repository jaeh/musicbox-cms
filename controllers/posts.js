"use strict";

var path = require('path'),
    form = require('express-form'),
    field = form.field,
    mail = require(path.join(__dirname, '..', 'lib', 'mail'));


// Form filter and validation middleware
exports.formMiddleWare = form(
    field('name').trim().required().isAlphanumeric(),
    field('email').trim().required().isEmail(),
    field('subject').trim().required(),
    field('text').trim().required()
);

exports.contact = function (req, res, next) {
// Express request-handler now receives filtered and validated data
    var errs = [],
        mailSent = false,
        key = '';

    if (!req.form.isValid) {
        // pass errors on to user. this are only form errors, not email errors!
        errs = req.form.errors;
    } else {
        //send mail
        mail.sendMail(req.form, res.locals.config);
        mailSent = true;        //this actually says nothing. emails should be logged before sending.
    }

    res.render(req.app.get('theme') + '/pages/contact', {errs: errs, mailSent: mailSent, name: req.form.name});
};
