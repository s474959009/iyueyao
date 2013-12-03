
/*
 * GET home page.
 */
var admin = require('./admin')
	,topic = require('./topic')
	,blog = require('./blog');

module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index', { title: '测试' });
	});

	app.get('/admin',admin);
	app.get('/topic',topic);
	app.get('/blog',blog);
};