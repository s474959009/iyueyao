/**
 * Created by hebo on 13-12-5.
 */
var Post = require('../models/post');

var index = function(req,res){
	Post.getAll(null, function (err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title: '主页',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
};



exports.index = index;
