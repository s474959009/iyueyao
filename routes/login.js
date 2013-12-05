/**
 * Created by hebo on 13-12-5.
 */
var crypto = require('crypto')
	,User = require('../models/user');


var index = function(req,res){
	res.render('login',{
		title:'login'
		,user: req.session.user
		,success: req.flash('success').toString()
		,error: req.flash('error').toString()
	});
} ;
var signin = function(req,res){
	var md5 = crypto.createHash('md5')
		,password = md5.update(req.body.password).digest('hex');

	User.get(req.body.name, function (err, user) {
		if (!user) {
			req.flash('error', '用户不存在!');
			return res.redirect('/login');
		}

		if (user.password != password) {
			req.flash('error', '密码错误!');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登陆成功!');
		res.redirect('/');
	});
} ;
var logout = function (req, res) {
	req.session.user = null;
	req.flash('success', '登出成功!');
	res.redirect('/');
}












exports.index = index ;
exports.signin = signin ;
exports.logout = logout;
