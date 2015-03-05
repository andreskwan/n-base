//dev enviroment
var env           = process.env.NODE_ENV || 'production';
var express       = require('express'); 
var middlewares   = require('./middlewares/admin.js');
// var cons       = require('consolidate');
var swig          = require('swig');
var logger        = require('./lib/logger/logger.js');

//routes
var router        = require('./website/router.js');
var RESTapi       = require('./lib/restApi/productsAPI.js');
//creando el objeto
var ExpressServer = function (config){
	//si vacio, es un objeto vacio
	config = config || {};
	//creo instancia
	this.app = express();
	//middlewares
	for (var middleware in middlewares){
		this.app.use(middlewares[middleware]);
		// logger.info("middleware activado:",middleware);
	}
	/**
	*	template engine - Swig
	*/
	//define engine
	this.app.engine('html', swig.renderFile);
	//como template de vista use html y asi asocia a swig
	this.app.set('view engine', 'html');
	//donde estan los html?
	this.app.set('views', __dirname + '/website/views/templates');
	/**
	*	Dev enviroment configuration
	*/
	if (env == 'development'){
		
		this.app.set('view cache', false);
		// swig.setDefaults({cache: false, varControls:['[[',']]']});
		swig.setDefaults({cache: false});
	}
	// logger.info('Environment :', env.toUpperCase());
	/**
	*	routes
	*/
	//Model REST 
	this.app.use(RESTapi);

	//Router and controllers
	for (var controller in router){
		//identificar los prototipos 
		// logger.info("controller   : ",controller);
		// logger.info("router["+controller+"].prototype",router[controller].prototype);
		for (var funcionalidad in router[controller].prototype){
			//si se sigue este formato
			//todas las funciones deben escribirse de esta manera
			//es decir que lo echo por bouritica debe ser modificado
			var method          = funcionalidad.split('_')[0];
			var entorno         = funcionalidad.split('_')[1];
			var data            = funcionalidad.split('_')[2];
			data = (method == 'get' && data !== undefined) ? ':data' : '';
			// var url = (controller == 'home')? '/':'/' + controller + '/' + entorno + '/' + data;
			var url = (controller == 'home')? '/':'/' + entorno + '/' + data;
			// debugger;
			logger.info("controller: "+controller+', func: '+funcionalidad+', '+'method: '+method+', '+'url: '+url);
			this.router(controller, funcionalidad, method, url);
		}
	} 
	// this.app.use(function (req,res) {
 //    res.render('404', {url:req.url});
// });
}; 

ExpressServer.prototype.router = function (controller, funcionalidad, method, url){
	// logger.info(controller+"-router app.method   : ",method);
	this.app[method](url, function (req, res, next){
		var conf = {
			//funcionalidad 
			'funcionalidad': funcionalidad,
			'req'          : req,
			'res'          : res,
			'next'         : next
		};
		// debugger;
		var Controller = new router[controller](conf);
		// logger.info();
		// debugger;
		Controller.response();
	});
}

module.exports = ExpressServer;