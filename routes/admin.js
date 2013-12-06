/**
 * Created by hebo on 13-12-3.
 */
var Post = require('../models/post');

var index = function(req,res){
	  res.render('admin',{
		  title:'admin'
		  ,user: req.session.user
		  ,success: req.flash('success').toString()
		  ,error: req.flash('error').toString()
	  })
} ;

var post = function(req,res){
	var currentUser = req.session.user
		,post = new Post(currentUser.name, req.body.title, req.body.post,req.body.type);
	post.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.send({status:'false',msg:err});
		}
		req.flash('success', '发布成功!');
		res.send({status:'true',msg:'发布成功！'});

	});
} ;


exports.index = index ;
exports.post = post ;