/**
 * Created by hebo on 13-12-22.
 */
var Post =require('../models/post_mongoose');

var index = function(req,res){

	  Post.getTag(function(err,post){
		  res.render('tags',{
			  title:'TAGS',
			  user: req.session.user,
			  posts:post,
			  success: req.flash('success').toString(),
			  error: req.flash('error').toString()
		  })
	  })
} ;

var tag = function(req,res){
	Post.getByTag(req.params.tag,function(err,post){
		if (err) {
			req.flash('error',err);
			return res.redirect('/');
		}
		res.render('tag_detail', {
			title: 'TAG:' + req.params.tag,
			posts: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	})
}



exports.index = index;
exports.tag = tag;
