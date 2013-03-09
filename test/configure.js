"use strict";

/*global describe:false, it:false, should:false, equal:false */


var express = require('express'),
    cons = require('consolidate'),
    swig = require('swig'),
    stylus = require('stylus'),
    path = require('path'),
    app = require(path.join(__dirname, '..', 'app')),
    configure = require(path.join(__dirname, '..', 'lib', 'configure'));


describe('do the configuration', function () {
    it('should return true if configure.do is callable', function () {
        configure.do(app).should.equal(true);
    });
});
