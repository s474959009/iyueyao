/**
 * Created by hebo on 13-12-3.
 */
var Post = require('../models/post');

var index = function(req,res){
	Post.getAll(null, function (err, posts) {
		if (err) {
			posts = [];
		}
		res.render('admin', {
			title: 'Admin',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
} ;

var post = function(req,res){
	var currentUser = req.session.user
		,post = new Post(currentUser.name, req.body.title, req.body.post,req.body.img||'',req.body.type);

	post.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.send({status:'false',msg:err});
		}
		req.flash('success', '发布成功!');
		res.send({status:'true',msg:'发布成功！'});
	});
} ;

var edit = function(req,res){
	res.render('edit', {
		title: 'edit',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
} ;

var remove = function(req,res){
	var currentUser = req.session.user;
	Post.remove( req.params.day, req.params.title, function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		req.flash('success', '删除成功!');
		res.redirect('/');
	});
}


exports.index = index ;
exports.post = post ;
exports.edit = edit ;
exports.remove = remove ;