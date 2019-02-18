var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'wddlzb1314o',
  database : 'web'
});

module.exports = connection