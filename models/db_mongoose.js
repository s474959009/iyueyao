
var settings = require('../config')
    ,mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/'+settings.db);
module.exports = mongoose;

