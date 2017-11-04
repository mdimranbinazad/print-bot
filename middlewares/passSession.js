module.exports = function(req, res, next) {
  res.locals.login = req.session.login;
  res.locals.username = req.session.username;
  res.locals.status = req.session.status;
  next();
}
