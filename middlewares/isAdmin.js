module.exports = function(req, res, next) {
  if ( req.session.status == "admin" ) {
    return next();
  }
  req.flash("info", "You must be admin to proceed");
  return res.redirect('/');
}
