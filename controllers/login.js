const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('mongoose').model('User');
const printer_names = require('config').printer_names;

router.get('/login', handler_login);
router.post('/login', hander_post_login);
router.get('/logout', handler_logout);

function handler_login (req,res){
  return res.render('login.pug');
}

function hander_post_login (req,res){
  const {username, password} = req.body;
  User.findOne({username}).then(function(user){
    if (!user) throw new Error("Wrong username or password");
    return user.comparePassword(password)
      .then(function(match){
        if (!match) throw new Error("Wrong username or password");
        req.session.login = true;
        req.session.username = username;
        req.session.status = user.status;
        req.session.printer = printer_names[user.printer];
        return res.redirect('/');
      })
  })
  .catch(function(err){
    return res.send(err.message);
  })
}

function handler_logout (req, res){
  req.session.destroy(function(err){
    return res.redirect('/');
  })
}

module.exports = {
  addRouter(app) {
    app.use('/user', router);
  }
};
