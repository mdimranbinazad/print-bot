const express = require('express');
const app = express();
const server = require('http').createServer(app);

const bodyParser = require('body-parser');
const path = require('path');
const rootPath = __dirname;

app.set('port', 6031);
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));

app.use('/', express.static(path.join(rootPath, '/public')));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

require('./config/database.js');
require('./config/session.js').addSession(app);

require('./controllers/user.js').addRouter(app);
require('./controllers/admin.js').addRouter(app);
require('./controllers/login.js').addRouter(app);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

app.get('*', function(req, res) {
  return res.status(404).send('Page not found\n');
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
