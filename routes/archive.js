/**
 * Created by DFH on 13-12-19.
 */

var Post = require('../models/post');

var index = function(req,res){
    Post.getArchive(function(err,posts){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('archive', {
            title: '存档',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

exports.index = index;

