/**
 * Created by hebo on 13-12-5.
 */

var crypto = require('crypto')
	,User = require('../models/user');

var index = function(req,res){
	res.render('reg', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

var active = function(req,res){
	var name = req.body.name
		,password = req.body.password
		,password_re = req.body['password-repeat'];

	if (password_re != password) {
		req.flash('error', '两次输入的密码不一致!');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5')
		,password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: name
		,password: password
		,email: req.body.email
	});
	User.get(newUser.name, function (err, user) {
		if (user) {
			req.flash('error', '用户已存在!');
			return res.redirect('/reg');
		}
		newUser.save(function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = user;
			req.flash('success', '注册成功!');
			res.redirect('/');
		});
	});
}



exports.index = index ;
exports.active = active ;
