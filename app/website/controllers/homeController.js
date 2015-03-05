var logger   = require('../../lib/logger/logger.js');
var HomeView = require('../views/HomeView.js');
// var HomeModel = require('../models/HomeModel.js');

var Home = function (conf){
	conf        = conf || {};
	this.view   = new HomeView();
	// this.model  = new HomeModel();
	this.response = function() {
		//accediendo al prototipo
		this[conf.funcionalidad] (conf.req, conf.res, conf.next);
		//funcionalidad invocada desde el browser
		// logger.info("conf.funcionalidad   : ",conf.funcionalidad);
	}
}

Home.prototype.get_home = function (req, res, next){
	//aqui creo que deberia ser POST
	// res.render('Home_add', {nombre:"get_add"});
	// debugger;
	var object = {nombre:"get_add"};
	this.view.add(res, object);
}

module.exports = Home;