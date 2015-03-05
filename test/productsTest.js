//---------------------------
//Supertest
//para hacer solicitud al 
//hace lo mismo que postman 
var request  = require('supertest-as-promised');
var api      = require('../server.js');
var logger   = require('../app/lib/logger/logger.js');
// var async = require('async');
//correr pruebas con diferentes host
var host     = process.env.API_TEST_HOST || api;
request      = request(host);

function createObject(){
	var id;
	var data = {
		objeto:{
			name: 'Azurite',
			description: "Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.",
			shine: 8,
			price: 110.50,
			rarity: 7,
		  	color: '#CCC',
		  	faces: 14,
		  	images: [
		    	"images/gem-02.gif",
		    	"images/gem-05.gif",
		    	"images/gem-09.gif"
		  	],
		    reviews: [{
		    stars: 5,
		    body: "I love this gem!",
		    author: "joe@example.org"
		    }, {
		    stars: 1,
		    body: "This gem sucks.",
		    author: "tim@example.org"
		  	}]}
		 }; 
	return request.post('/objetos')
		.set('Accept', 'application/json')
		.send(data)
		.expect(201)
		.then(function getobjeto (res){
			this.id = res.body.objeto.id;
			// logger.info("BEFORE - res.body",res.body);
		}.bind(this));
};

function createObjects(){
	var id;
	var data1 = {
		objeto: {
			"title": "objeto 1",
			"description": "Introduccion a clase",
			"type": "js", // tipo de dato de la objeto, permitir highlight and warnings 
			"body": "soy el cuerpo de json"
		}
	};
	var data2 = {
		objeto: {
			"title": "objeto 2",
			"description": "Introduccion a clase",
			"type": "js", // tipo de dato de la objeto, permitir highlight and warnings 
			"body": "soy el cuerpo de json"
		}
	};
	request.post('/objetos')
		.set('Accept', 'application/json')
		.send(data1)
		.expect(201)
		.end();
	request.post('/objetos')
		.set('Accept', 'application/json')
		.send(data2)
		.expect(201)
		.end();
};
//hacer una prueba del resource objetos.js
//esta funcion describe el contexto de la prueba inicial
describe('resource /objetos', function (){
	//La primera prueba sera POST
	describe('POST', function () {
		it('should return/create a new Object', function (done){
			// throw new Error('tengo hambre'); 
			// return true;
			//crear objeto nueva
			var data = {
					"objeto":{
						name: 'Azurite',
						description: "Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.",
						shine: 8,
						price: 110.50,
						rarity: 7,
					  	color: '#CCC',
					  	faces: 14,
					  	images: [
					    	"images/gem-02.gif",
					    	"images/gem-05.gif",
					    	"images/gem-09.gif"
					  	],
					    reviews: [{
						    stars: 5,
						    body: "I love this gem!",
						    author: "joe@example.org"
					    }, {
					    	stars: 1,
					    	body: "This gem sucks.",
					    	author: "tim@example.org"
					  	}]} 
			};
			//};
			//usar supertest para hacer request
			//1 crear solicitud de http/POST enviando data
			request.post('/objetos')
				//------------------
				//Post - send - create
				//------------------
				//format: usar el encabezado para identificar el resource 
				//         accept application/json
				.set('Accept', 'application/json')
				//body: objeto en json
				.send(data)
				//------------------
				//Resp - from node.js server
				//------------------
				//status code
				//pasar nuestras expectativas
				.expect(201)
				.expect('Content-Type', /application\/json/)
				//callback para evaluar el body
				.end(function (err, res){
					var body = res.body;
					//does the Object exist?
					expect(body).to.have.property('objeto');
					objeto = body.objeto;
					expect(objeto).to.have.property('name', 'Azurite');
					expect(objeto).to.have.property('description', 'Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.');
					expect(objeto).to.have.property('shine', 8);
					expect(objeto).to.have.property('price', 110.50);
					expect(objeto).to.have.property('id');
					done();
				});
				// .expect('Content-type', /application\/json/)	
				// .end(function (err, res){
				// 	var body = res.body;
				// 	expect(body).to.have.property('objeto');
		});
	});	
	describe('GET', function() {
		beforeEach(createObject);
		it('deberia obtener un objeto existente', function (done) {
			var id = this.id;
			return request.get('/objetos/'+id)
				.set('Accept', 'application/json')
				.send()
				.expect(200)
				.expect('Content-type', /application\/json/)
			.then(function assertions (res){
				var objeto = res.body.objetos;	
				expect(res.body).to.have.property('objetos');
				expect(objeto).to.have.property('id', id);
				expect(objeto).to.have.property('name', 'Azurite');
				expect(objeto).to.have.property('description', 'Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.');
				expect(objeto).to.have.property('shine', 8);
				expect(objeto).to.have.property('price', 110.50);
				done();
			}, done);
		});
		it.skip('deberia obtener una lista de todas las objetos', function (done){
			createObjects();
			return request.get('/objetos/')
				.send()
				.expect(201)
				.expect('Content-type', /application\/json/)
			.then(function assertions (res){
				var objeto = res.body;	
				logger.info("res.body:",res.body);
				expect(res.body).to.have.property('objetos')
					.and.to.be.an('array')
					.and.to.have.length.above(0);
				done();
			}, done);
		});
	});
	describe('PUT', function() {
		beforeEach(createObject);
		it('deberia actualizar un objeto existente', function (done) {
			var id = this.id;
			return request.get('/objetos/'+id)
				.set('Accept', 'application/json')
				.send()
				.expect(200)
				.expect('Content-type', /application\/json/)
			//editar objeto
			.then(function putObjeto (res){
				// logger.info('in putObjeto');
				//get returns objetos
				// logger.info('res.body: ',res.body);
				// logger.info('res.body.objetos: ',res.body.objetos);
				var objetoActualizada = res.body.objetos;
				// logger.info("objeto original: ", objetoActualizada);
				objetoActualizada.title = "objeto actualizada Kwan";
				return request.put('/objetos/'+id)
					.send({objeto:objetoActualizada})
					.expect(200)
					.expect('Content-type', /application\/json/)
			}, done)
			//eveluar que la objeto se haya actualizado correctamente
			.then(function assertions (res){
				// logger.info("in assertions");

				var objetoValidar = res.body.objeto;	
				// logger.info('res.body:',res.body);
				// logger.info('objetoValidar',objetoValidar);
				expect(res.body).to.have.property('objeto');
				expect(objetoValidar).to.have.property('id', id);
				expect(objeto).to.have.property('name', 'Azurite');
				expect(objeto).to.have.property('description', 'Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.');
				expect(objeto).to.have.property('shine', 8);
				expect(objeto).to.have.property('price', 110.50);
				done();
			}, done) 
		});
	});
	describe('DELETE', function() {
		beforeEach(createObject);
		it('deberia borrar un objeto existente', function (done){
			var id = this.id;
			return request.delete('/objetos/'+id)
			.expect(204)
			.then(function assertObjectDestroyed(res){
				return request.get('/objetos/'+id)
				.expect(400);				
			}, done)
			.then( function (){
				done();
			});
		});
	});	
});

