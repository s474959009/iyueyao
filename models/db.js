/**
 * Created by hebo on 13-12-4.
 */
var settings = require('../config')
	,Db = require('mongodb').Db
	,Connection = require('mongodb').Connection
	,Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});
