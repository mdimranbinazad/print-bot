module.exports = function(req, res, next) {
  res.locals.login = req.session.login;
  next();
}
