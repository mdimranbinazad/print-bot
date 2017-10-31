const express = require('express');
const printer = require('printer');
const router = express.Router();
const _ = require('lodash');

router.get('/printers', handler_printers);
router.get('/jobs', handler_jobs);
router.get('/jobs/delete/:printerName/:jobId', handler_jobs_delete);

function handler_printers (req,res){
  res.send(_.map(printer.getPrinters(), 'name'));
}

function handler_jobs (req,res){
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
}

function handler_jobs_delete (req,res){
  const {printerName, jobId} = req.params;
  printer.setJob(printerName, parseInt(jobId), 'CANCEL');
  return res.redirect('/jobs');
}

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};
