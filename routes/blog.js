/**
 * Created by hebo on 13-12-3.
 */
var Post = require('../models/post');
var index = function(req,res){
	res.render('blog',{
		title:'blog'
		,user: req.session.user
		,success: req.flash('success').toString()
		,error: req.flash('error').toString()
	});
} ;

var detail = function(req,res){
	Post.getOne( req.params.day, req.params.title, function (err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('detail', {
			title: req.params.title,
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
}


exports.index = index;
exports.detail = detail;