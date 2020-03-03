const express = require('express');
const printer = require('printer');
const router = express.Router();
const _ = require('lodash');
const isAdmin = require('../config').middlewares.isAdmin;
const csv_parse = require('csv-parse');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/printers', handler_printers);
router.get('/jobs', handler_jobs);
router.get('/jobs/delete/:printerName/:jobId', handler_jobs_delete);
router.get('/dashboard', get_dashboard);
router.get('/dashboard/addUser', get_dashboard_addUser);
router.post('/dashboard/addUser', post_dashboard_addUser);
router.get('/logoutAll', get_logoutAll);
router.get('/userList', get_userList);
router.get('/editUser/:username', get_editUser_Username);
router.post('/editUser/:username', post_editUser_Username);

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

/**
 * Remove all documents from sessions collection
 * @return {Promise}
 */
function deleteSession(){
  return mongoose.connection.db.collection('sessions').remove({});
}

function post_dashboard_addUser(req, res, next){
  const csv = req.body.usercsv;

  csv_parse(csv,{columns: null},function(err, users){
    if ( err ) {
      return next(err);
    }
    // Trim the strings
    users = _.map(users, function(user){
      return _.map(user,function(str){
        return _.trim(str);
      })
    })
    // Hash the passwords
    const hashArr = _.map(users,function(user){
      return User.createHash(user[1]);
    })
    Promise.all(hashArr)
      .then(function(hash){
        // Convert to User model and save them
        return _.map(users, function(user, index){
          return new User({
            username: user[0],
            password: hash[index],
            printer: user[2]
          }).save();
        })
      })
      .then(function(userPromise){
        // Before saving new users, remove all users with status "users"
        return User.remove({status: "user"})
          .then(deleteSession) // Logout users
          .then(function(){
            return Promise.all(userPromise)
              .then(function(){
                req.flash('success', 'Users created.')
                return res.redirect('/admin/dashboard');
              })
          })
      }).catch(function(err){
        console.log(err);
        req.flash('error', 'Some error occured. Check console.');
        return res.redirect('/admin/dashboard/addUser');
      })
  })
}

function get_logoutAll(req, res){
  deleteSession()
    .then(function(){
      req.flash('success', 'Everyone has been logged off except you');
      return res.redirect('/admin/dashboard');
    })
    .catch(function(err){
      req.flash('error', 'Some error occured');
      return res.redirect('/admin/dashboard');
    })
}

function get_userList(req, res, next){
  User.find().exec()
    .then(function(users){
      users.sort(function(a,b){
        return a.username.localeCompare(b.username);
      })
      return res.render('admin/userList', {users});
    })
    .catch(next);
}

function get_editUser_Username(req, res, next){
  const username = req.params.username;
  User.findOne({username}).exec()
    .then(function(user){
      if (!user) throw new Error('No such username');
      return res.render('admin/editUser', {user});
    })
    .catch(next)
}

function post_editUser_Username(req, res, next){
  const username = req.params.username;
  const updateFields = {
    printer: req.body.printer,
    pagePrinted: req.body.pagePrinted,
    totalPageLimit: req.body.totalPageLimit
  }
  User.findOneAndUpdate({username},{$set:updateFields}).exec()
    .then(function(oldUser){
      if (!oldUser) throw new Error('No such username');
      req.flash('success', 'Update successful');
      return res.redirect('/admin/userList');
    })
    .catch(next);
}

module.exports = {
  addRouter(app) {
    app.use('/admin', isAdmin, router);
  }
};
