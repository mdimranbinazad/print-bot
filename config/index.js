const {
  secret,
  pagePerPrintLimit,
  totalPageLimit
} = require('../secret/config');

module.exports = {
  secret,
  pagePerPrintLimit,
  middlewares: require('../middlewares'),
  user_info: require('./credentials')
};
