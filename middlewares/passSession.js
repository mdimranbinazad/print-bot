const _ = require('lodash');

module.exports = function(req, res, next) {
  _.forEach(req.session, function(value, key){
    res.locals[key] = value;
  })
  next();
}
