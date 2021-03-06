/*
 * routes
 */
var crypto = require('crypto')
	,flash = require('connect-flash');

var admin = require('./admin')
	,home = require('./home')
	,topic = require('./topic')
	,blog = require('./blog')
	,login = require('./login')
    ,archive = require('./archive')
    ,register =require('./register')
	,tags = require('./tag')
	,test = require('./test')
	,User = require('../models/user')
	,Post = require('../models/post_mongoose')
	,upload = require('./upload')
    ,config = require('../config');

module.exports = function(app){

	app.get('/', home.index);

	if(config.development){
        app.get('/reg', checkNotLogin);
        app.get('/reg', register.index);
        app.post('/reg', checkNotLogin);
        app.post('/reg', register.active);

        app.get('/test',test.index);
        app.get('/test/:uuid',test.detail);
        app.post('/test',test.post);
    }


	app.get('/login', checkNotLogin);
    app.get("/login",login.index);
	app.post('/login', checkNotLogin);
	app.post('/login',login.signin);
	app.get('/logout', checkLogin);
	app.get('/logout', login.logout);

	app.post('/post', checkLogin);
	app.post('/post', admin.post);

	//app.post('/commont/:uuid',admin.commont);

	app.post('/upload',upload.index);


	app.get('/admin',checkLogin);
	app.get('/admin',admin.index);
	app.get('/admin/edit/:type/:uuid',checkLogin);
	app.get('/admin/edit/:type/:uuid',admin.edit);

	app.post('/admin/edit/:type/:uuid',checkLogin);
	app.post('/admin/edit/:type/:uuid',admin.update);

	app.get('/admin/remove/:type/:uuid',checkLogin);
	app.get('/admin/remove/:type/:uuid',admin.remove);

	app.get('/topic',topic.index);
	app.get('/topic/:uuid',topic.detail);

	app.get('/blog',blog.index);
	app.get('/blog/:uuid', blog.detail);

    app.get('/archive',archive.index);

    app.get('/tags',tags.index);
    app.get('/tags/:tag',tags.tag);

    app.get('/about',admin.about);



	app.get('*',function(req,res,next){
		//console.log(req.ip);
		next();
	});
	app.use(function (req, res) {
		res.render("404");
	});

	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录!');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录!');
			res.redirect('back');//返回之前的页面
		}
		next();
	}
};

