const {
  secret,
  pagePerPrintLimit = 10,
  totalPageLimit = 50,
  printer_names,
  port = 8080,
} = require('../secret/config');

module.exports = {
  secret,
  pagePerPrintLimit,
  printer_names,
  totalPageLimit,
  port,
  middlewares: require('../middlewares'),
};
