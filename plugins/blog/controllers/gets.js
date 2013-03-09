"use strict";

var path = require('path'),
    fs = require('fs');

exports.postList = function (req, res) {
    var postDir = path.join(req.app.get('theme'), 'blog', 'posts'),
        postIdx;

    var posts = fs.readdirSync(path.join(req.app.get('views'), postDir));

    res.locals.postList = [];
    
    console.log('req.app = ');
    console.log(req.app);
    
    for (postIdx in posts) {
        var postFile = posts[postIdx];

        if (typeof postFile === 'string' && postFile.indexOf('.html')) {

            res.locals.postList.push(path.join(req.app.get('theme'), 'blog', 'posts', postFile));
        }
    }
    res.render(req.app.get('theme') + '/blog/postList');
};

exports.post = function (req, res) {

    var postFile = path.join(req.app.get('theme'), 'blog', 'posts', req.params.post + '.html');

    fs.exists(path.join(req.app.get('views'), postFile), function (exists) {

        if (!exists) {
            res.redirect('404');
        } else {
            res.render(req.app.get('theme') + '/blog/post.html', {postFile: postFile});
        }
    });
}
