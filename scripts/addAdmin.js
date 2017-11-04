const mongoose = require('mongoose');
const dburl = "mongodb://localhost:27017/print_db";
const readline = require('readline');
const _ = require('lodash');

mongoose.Promise = global.Promise;
const promise = mongoose.connect(dburl, {
  useMongoClient: true
});

promise.then(function(db) {
  console.log('Successfully connected to database');

  require('../models/user');
  const User = mongoose.model('User');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function warning (){
    _.times(5, function(){
      console.log("***Warning*** This script will remove all content from user table. Press Ctrl+C to quit.");
    })
  }

  warning();

  rl.question('Enter username for admin: ', function(username){
    warning();
    rl.question('Enter password for admin: ', function(password){
      User.createHash(password).then(function(pass){
        password = pass;
        return User.remove();
      }).then(function(){
        const user = new User({
          username,
          password,
          status: 'admin'
        });
        return user.save();
      }).then(function(){
        console.log(`Admin created`);
        process.exit();
      }).catch(function(err){
        console.log(`Some error occured`);
        process.exit();
      })
    })
  });
}).catch(function(err){
  console.log(err);
  console.log('Database not connected');
  process.exit()
})
