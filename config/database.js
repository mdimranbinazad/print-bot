const mongoose = require('mongoose');
const dburl = "mongodb://localhost:27017/print_db";

mongoose.Promise = global.Promise;
const promise = mongoose.connect(dburl, {
  useMongoClient: true
});

promise.then(function(db) {
  console.log('Successfully connected to database');
})
