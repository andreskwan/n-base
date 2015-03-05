var logger      = require('../../lib/logger/logger.js');

var Home = function (conf){
	conf = conf || {};
}

Home.prototype.add = function (res, object){
	// debugger;
	res.render('home', object);
}

module.exports = Home;