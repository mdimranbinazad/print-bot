const express = require('express');
const fs = require('fs');
const config = require('config');
const middlewares = config.middlewares;
const login = middlewares.login;
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
const base64 = require('base64-stream');
const router = express.Router();
const printTest = false;
const ip = require('ip');

function getReqIp(req){
  let reqIp = ( req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress ).split(':')[3];

  if ( !reqIp ) reqIp = ip.address();
  return reqIp;
}

router.get('/', login, handler_index);
router.post('/printCode', login, handler_post_printCode);

function handler_index (req,res){
  return res.render('layout', {
    ip: getReqIp(req)
  });
}

function saveToFile(pdfDoc) {
  pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
}

function getPDFString(code, reqIp, cb){
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

  let finalString = ''; // contains the base64 string
  const stream = pdfDoc.pipe(base64.encode());

  pdfDoc.end();

  stream.on('data', function(chunk) {
    finalString += chunk;
  });

  stream.on('end', function() {
    const buf = Buffer.from(finalString,'base64');
    cb(null, buf);
  });

  if ( printTest ) {
    const pdfToSave = pdfmake.createPdfKitDocument(docDef);
    saveToFile(pdfToSave);
    pdfToSave.end();
  }
}

function handler_post_printCode (req,res){
  const code = req.body.code;
  const reqIp = getReqIp(req);

  getPDFString(code, reqIp, function(err, pdfString){
    if ( !printTest ) {
      printer.printDirect({
        data: pdfString,
        type: 'PDF',
        options: {
          media: 'A4'
        },
        success: function(jobID){
          console.log("Sent to printer with ID: "+ jobID);
          return res.send('Sent to printer');
        },
        error: function(err){
          console.log(err);
          return res.send('Some error occured. Please try again.');
        }
      })
    } else {
      return res.send('Testing mode.');
    }
  });
}

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};
