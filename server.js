/**
* Dependencies
*/
var logger        = require('./app/lib/logger/logger.js');
var http          = require('http');
var ExpressServer = require('./app/expressServer.js')
// var mongoose      = require('mongoose');
// var socketIO      = require('./app/socketIO.js');
var conf          = require('./conf.json'); 

var port    = process.env.PORT || conf.port;
var express = new ExpressServer();
var server  = http.createServer(express.app);

if (!module.parent) {
	server.listen(port, function (){
		logger.info('http://localhost:'+port);
	});
}else{
	//se exporta el servicio - app para que las pruebas lo consuman
	module.exports = server;
}