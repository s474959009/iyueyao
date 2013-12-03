
/*
 * GET home page.
 */
var topic = require('./topic');
var admin = require('./admin');
var blog = require('./blog');
var labs = require('./labs');


module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index', { title: 'Hello' });
	});


	app.get('/topic',topic.list);
	app.get('/admin',admin);
	app.get('/blog',blog);
	app.get('/labs',labs);
};