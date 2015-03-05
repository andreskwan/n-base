var bodyParser    = require('body-parser');

// parse application/x-www-form-urlencoded
module.exports = bodyParser.urlencoded(
	{extended: true});