var express = require('express');
var router = express.Router();
var connection = require('../db')

const sql = {
  add: 'insert into users(ID, UserName, PassWord) values',
  check: 'select * from users'
}

/* GET users listing. */
router.post('/add', function(req, res, next) { // 新增用户
  console.log(req)
  connection.query(sql, function (err, result) {
    // 
  })
});

router.post('/login', function(req, res, next) { // 登录
  connection.query(`${sql.check} where UserName = '${req.body.params.UserName}' and PassWord = '${req.body.params.PassWord}' limit 1;`, function (err, result) {
    // console.log(result)
    res.json(result)
  })
})

module.exports = router;
