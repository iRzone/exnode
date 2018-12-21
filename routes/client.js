var express = require('express');
var router = express.Router();
var connection = require('../db/index.js')

var sql = 'SELECT * FROM websites'

connection.connect();

/* GET client listing. */
router.get('/', function(req, res, next) {
  res.send('/client');
});

router.get('/msg', function(req, res, next) {
  connection.query(sql, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.json(result)
    }
  })
});

module.exports = router;
