module.exports = function(req, res, next) {
  if ( !req.session || !req.session.login ) {
    return res.redirect("/login");
  }
  next();
}
