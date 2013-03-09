"use strict";

/*global describe:false, it:false, should:false, equal:false */

var fs = require('fs'),
    path = require('path'),
    should = require('should'),
    form = require('express-form'),
    config = require(path.join(__dirname, '..', 'config', 'development')),
    mail = require(path.join(__dirname, '..', 'lib', 'mail')),
    mailform = {
        name: "user",
        email: "user@domain.tld",
        subject: "email subject",
        text: "email text"
    };

describe('send a mail', function () {
    it('should return smtp code 250 or OK if the email form data completely exists and gmail can be accessed', function (done) {
        mail.sendMail(mailform, config, function (error, response) {
            //testing the smtp response for the 250 OK response
            (response.message.indexOf("250") === -1 || response.message.indexOf("OK") === -1).should.equal(false);
            done();
        });
    });
});
