var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + '../static-views/index.html');
});




module.exports = router;
