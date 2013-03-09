"use strict";

/*global describe:false, it:false, should:false, equal:false */

var fs = require('fs'),
    path = require('path'),
    templatePath = path.join(__dirname, '..', 'views');

describe('TemplateFilesExist', function () {
    it('should return true if the template exists', function () {

        fs.exists(path.join(templatePath, "layout.html"), function (exists) {
            exists.should.equal(true);
        });
        fs.exists(path.join(templatePath, "pages", "fourohfour.html"), function (exists) {
            exists.should.equal(true);
        });
        fs.exists(path.join(templatePath, "pages", "index.html"), function (exists) {
            exists.should.equal(true);
        });
    });
});
