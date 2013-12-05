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

var post = function(req,res,callback){
	var currentUser = req.session.user
		,post = new Post(currentUser.name, req.body.title, req.body.post,req.body.type);
	console.log(currentUser.name+'/'+req.body.title+'/'+req.body.post+'/'+req.body.type);
	post.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发布成功!');
		res.redirect('/');//发表成功跳转到主页
	});
}


exports.index = index ;
exports.post = post ;