const express = require('express');
const printer = require('printer');
const router = express.Router();

router.get('/printers', function(req,res){
  res.send(printer.getPrinters())
})

router.get('/jobs', function(req,res){
  const details = printer.getPrinters();

  const jobQ = [];
  details.forEach(function( p ) {
    const printerName = p.name;
    if ( p.jobs ) {
      p.jobs.forEach ( function (j) {
        console.log();
        const jobID = j.id;
        const status = j.status[0];
        jobQ.push({printerName, jobID, status})
      })
    }
  })

  return res.render('jobList', {jobQ} );
})

router.get('/jobs/delete/:printerName/:jobId', function(req,res){
  const {printerName, jobId} = req.params;
  printer.setJob(printerName, parseInt(jobId), 'CANCEL');
  return res.redirect('/jobs');
})

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};
