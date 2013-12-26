/**
 * Created by hebo on 13-12-25.
 */

var Post = require('../models/post_mongoose');

var index = function(req,res){
	var page = req.query.p ? parseInt(req.query.p) : 1;
	Post.search('asdf',function(err,posts){
		res.render('test',{
			title: 'edit',
			posts:posts
		})
	})
};
var detail = function(req,res){
	Post.getOne( req.params.uuid,'blog', function (err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log(post.title);
		res.render('test_detail', {
			title: 'edit',
			post:post
		});
	});
} ;

var post =function(req,res){
	var currentUser = req.session.user
		,homeRecom = req.body.homeRecom=='on'?true:false
		,img = req.body.img?req.body.img:''
		,desc = req.body.desc?req.body.desc:''
		,tags = req.body.tags? req.body.tags.split(','):[] ;
		//,post = new Post(currentUser.name, req.body.title, req.body.post,img,req.body.type,homeRecom,tags,desc);
	var posts = {
		name : currentUser.name ,
		title:req.body.title ,
		desc: desc  ,
		post :req.body.post  ,
		img : img ,
		type: req.body.type  ,
		homeRecom: homeRecom,
		tags : tags
	};
	var post = new Post(posts);
	post.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.send({status:'false',msg:err});
		}
		req.flash('success', '发布成功!');
		res.send({status:'true',msg:'发布成功！'});
	});
}



exports.index = index;
exports.detail = detail;
exports.post = post;