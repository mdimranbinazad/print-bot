const express = require('express');
const printer = require('printer');
const router = express.Router();
const _ = require('lodash');
const isAdmin = require('config').middlewares.isAdmin;

router.get('/printers', handler_printers);
router.get('/jobs', handler_jobs);
router.get('/jobs/delete/:printerName/:jobId', handler_jobs_delete);
router.get('/dashboard', get_dashboard);
router.get('/dashboard/addUser', get_dashboard_addUser);

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
  return res.redirect('/admin/jobs');
}

function get_dashboard(req, res){
  return res.render('admin/dashboard');
}

function get_dashboard_addUser(req, res){
  return res.render('admin/addUser');
}

module.exports = {
  addRouter(app) {
    app.use('/admin', isAdmin, router);
  }
};
