/**
 * Created by hebo on 13-12-3.
 */
var Post = require('../models/post');

var index = function(req,res){
	Post.getByType('blog',function(err,post){
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('blog',{
			title:'blog'
			,posts:post
			,user: req.session.user
			,success: req.flash('success').toString()
			,error: req.flash('error').toString()
		});
	})
} ;

var detail = function(req,res){
	Post.getOne( req.params.day, req.params.title,'blog', function (err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('blog_detail', {
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