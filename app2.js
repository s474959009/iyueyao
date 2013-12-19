/**
 * Created by DFH on 13-12-17.
 */

var uuid = require('uuid-v4');
var http = require('http');

var myUUID = uuid();
http.createServer(function(req,res){
    res.write(myUUID);
    res.end();
}).listen(8080);

// Generate a new UUID

