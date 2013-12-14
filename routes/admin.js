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
		,homeRecom = req.body.homeRecom=='on'?true:false
		,post = new Post(currentUser.name, req.body.title, req.body.post,req.body.img||'',req.body.type,homeRecom);

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
	var type = req.params.type
		,renders = type!='blog'?'topic_edit':'blog_edit';
	Post.edit(req.params.day, req.params.title, req.params.type,function(err,post){
			if(err){
				req.flash('error',err);
				return res.redirect('back');
			}
			res.render(renders, {
				title: 'edit',
				post:post,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});

	})

} ;

var remove = function(req,res){
	Post.remove( req.params.day, req.params.title,req.params.type, function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		req.flash('success', '删除成功!');
		res.redirect('/');
	});
};

var update = function(req,res){
	var homeRecom = req.body.homeRecom=='on'?true:false
		,url = '/'+req.params.type+'/'+req.params.day+'/'+req.params.title;
	Post.update(req.params.day, req.params.title, req.body.post, req.params.type,  homeRecom, req.body.img, function(err){
		if(err){
			req.flash('error', err);
			return res.send({status:'false',msg:'更新失败！'});
		}
		req.flash('success', '更新成功!');
		res.send({status:'true',msg:'更新成功！',url:url});
	})
};



exports.index = index ;
exports.post = post ;
exports.edit = edit ;
exports.remove = remove ;
exports.update = update ;