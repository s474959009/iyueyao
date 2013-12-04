
/*
 * GET home page.
 */
var crypto = require('crypto')
	,flash = require('connect-flash');

var admin = require('./admin')
	,topic = require('./topic')
	,blog = require('./blog')
	,User = require('../models/user')
	,Post = require('../models/post.js');

module.exports = function(app){
	app.get('/', function (req, res) {
		res.render('index', {
			title: '主页',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: req.body.name,
			password: password,
			email: req.body.email
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
	});

	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

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
	});
  app.get("/login",function(req,res){
	  res.render('login',{title:'login'});
  });





	app.post('/post', function (req, res) {
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
			post.save(function (err) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/');
				}
				req.flash('success', '发布成功!');
				res.redirect('/');//发表成功跳转到主页
			});
	});

	app.get('/admin',admin);
	app.get('/topic',topic);
	app.get('/blog',blog);
};