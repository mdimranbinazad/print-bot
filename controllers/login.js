const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
  return res.render('login.pug');
})

module.exports = {
  addRouter(app) {
    app.use('/login', router);
  }
};
