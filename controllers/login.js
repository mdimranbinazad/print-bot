const express = require('express');
const router = express.Router();

router.get('/', handler_index);

function handler_index (req,res){
  return res.render('login.pug');
}

module.exports = {
  addRouter(app) {
    app.use('/login', router);
  }
};
