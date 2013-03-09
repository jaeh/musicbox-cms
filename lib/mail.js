"use strict";

var path  = require('path');

module.exports.sendMail = function (form, config, cb) {
    var mailOptions = {
        from                  : form.name + " <" + form.email + ">", // sender address
        to                    : config.email, // list of receivers
        subject               : form.subject, // Subject line
        html                  : form.text, // html body
        generateTextFromHTML  : true
    };

    // send mail with defined transport object, no error logging for now
    config.smtp.sendMail(mailOptions, function (error, response) {

        //will be used for testing
        if (typeof cb === 'function') {
            cb(error, response);
        }

        config.smtp.close(); // shut down the connection pool, no more messages
    });
};
