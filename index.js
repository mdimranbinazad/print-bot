const express = require('express');
const app = express();
const server = require('http').createServer(app);

const ip = require("ip");

const bodyParser = require('body-parser');
const path = require('path');
const rootPath = __dirname;

const printer = require('printer');
const fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
	}
};
const pdfmake = new (require('pdfmake'))(fonts);
const fs = require('fs');

app.set('port', 6031);
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));

app.use('/', express.static(path.join(rootPath, '/public')));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

function getReqIp(req){
  return ( req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress ).split(':')[3];
}

app.get('/', function(req,res){
  return res.render('layout', {
    ip: getReqIp(req)
  });
})

function getPDF(code, reqIp){
  const docDef = {
    header: function(currentPage, pageCount) {
      return currentPage.toString() + ' of ' + pageCount + ` from ${reqIp}`;
    },
    content: {
      text: code,
      preserveLeadingSpaces: true
    },
    pageSize: 'A4',
  };


  const pdfDoc = pdfmake.createPdfKitDocument(docDef);
  return pdfDoc;
}

app.post('/printCode', function(req,res){
  const code = req.body.code;
  const reqIp = getReqIp(req);
  const pdfDoc = getPDF(code, reqIp);

  pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
  pdfDoc.end();
  res.send('pdf created');
  // printer.printDirect({
  //   data: req.body.code,
  //   type: 'TEXT',
  //   options: {
  //     media: 'A4'
  //   },
  //   success: function(jobID){
  //    console.log("Sent to printer with ID: "+ jobID);
  //    return res.send('Sent to printer');
  //   },
  //   error: function(err){
  //     console.log(err);
  //     return res.send('Some error occured. Please try again.');
  //   }
  // })
})

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
