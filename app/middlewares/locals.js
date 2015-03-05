
module.exports = function(req, res, next){
	res.locals.nick = 'Andres';
  // res.locals.user = req.user;
  // res.locals.authenticated = ! req.user.anonymous;
  //next me permite cargar otro middleware 
  //si lo quito, se queda esperando. 
  next();
};