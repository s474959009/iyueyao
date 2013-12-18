/**
 * Created by hebo on 13-12-3.
 */
var Post = require('../models/post');

var index = function(req,res){
	var page = req.query.p ? parseInt(req.query.p) : 1;
	Post.getFive('topic', page ,function(err,posts,total){
		if (err) {
			posts = [];
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('topic',{
			title:'topic'
			,posts:posts
			,page:page
			,isFirstPage: (page - 1) == 0
			,isLastPage: ((page - 1) * 5 + posts.length) == total
			,user: req.session.user
			,success: req.flash('success').toString()
			,error: req.flash('error').toString()
		});
	})

};


var detail = function(req,res){
	Post.getOne( req.params.uuid, 'topic',function (err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('topic_detail', {
			title: post.title,
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
}


exports.index = index ;
exports.detail = detail ;

