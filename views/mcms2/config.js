"use strict";

var nodemailer = require('nodemailer'),
    mail = 'microcmsmailtest@gmail.com'; //your mail address the contact page should use

module.exports = {
    name      : "mcms theme 2",            // name of this app
    author    : "mcms team",            //your name or the name of your company
    title     : "&#181;-cms theme 2",           //the page title will be used in the <title> tag and instead of the logo.
    branding  : "dry kiss",   //will be printed next to the title when no logo is used.
    logo      : "",                     //leave blank to use the title instead
    protocol  : "http://",              //http or https
    url       : "localhorst:2323",            //url this app can be reached at
    email     : mail,                   //your mail address the contact page should use
    smtp      : nodemailer.createTransport("SMTP", { //setup nodemailer
        service: "Gmail",               //uses gmail as default, see the nodemailer docs for other options
        auth: {
            user: mail,                 //the email your smtp server should use to forward the mails from the contact page
            pass: "microcmspassword"    //the password of your smtp server
        }
    })
};
