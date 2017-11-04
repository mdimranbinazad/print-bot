const {
  secret,
  pagePerPrintLimit,
  totalPageLimit,
  printer_names
} = require('../secret/config');

module.exports = {
  secret,
  pagePerPrintLimit,
  middlewares: require('../middlewares'),
  printer_names
};
