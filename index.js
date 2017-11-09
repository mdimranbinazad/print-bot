const express = require('express');
const app = express();
const server = require('http').createServer(app);

const bodyParser = require('body-parser');
const path = require('path');
const rootPath = __dirname;
const config = require('config');

app.set('port', config.port);
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));

app.use('/', express.static(path.join(rootPath, '/public')));


/**models**/
require('./config/database.js');
require('./models/log');
require('./models/user');

/**Application wide middlewares**/
require('./config/session.js').addSession(app);
app.use(require('connect-flash')());
app.use(bodyParser.json({limit: '100kb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100kb'
})); // support encoded bodies

/**Middlewares**/
app.use(require('./middlewares/flash'));
app.use(require('./middlewares/passSession'));

/**controllers**/
require('./controllers/print.js').addRouter(app);
require('./controllers/admin.js').addRouter(app);
require('./controllers/login.js').addRouter(app);

app.use(function(err, req, res, next) {
  console.error(err);
  if (err.name === 'PayloadTooLargeError' ) {
    req.flash('error', 'Your code is too big');
  } else {
    req.flash('error', 'Some error occured');
  }
  return res.redirect('/');
});

app.get('*', function(req, res) {
  req.flash('error', 'Page not found');
  return res.status(404).redirect('/');
});

if (require.main === module) {
  server.listen(app.get('port'), function() {
    console.log(`Server running at port ${app.get('port')}`);
  });
} else {
  module.exports = {
    server,
    app
  };
}
