var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.append('Access-Control-Allow-Origin','*');
  res.render('index', { title: 'Express' });
});

module.exports = router;