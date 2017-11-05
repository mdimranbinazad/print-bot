const {
  secret,
  pagePerPrintLimit = 10,
  totalPageLimit = 50,
  printer_names,
} = require('../secret/config');

module.exports = {
  secret,
  pagePerPrintLimit,
  printer_names,
  totalPageLimit,
  middlewares: require('../middlewares')
};
