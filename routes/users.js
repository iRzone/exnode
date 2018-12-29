var express = require('express');
var router = express.Router();
var connection = require('../db')
var Base64 = require('base-64')
// var bodyParser = require('body-parser')

// var app = express();

const sql = {
  add: 'insert into users(ID, UserName, PassWord) values',
  check: 'select * from users'
}

// app.use(bodyParser.json)   // 在其他路由中间件前（尽可能靠前，以能够通过bodyPaser获取req.body）
// app.use(bodyParser.urlencoded({ extended: false})) // 调试工具如果出现警告请加上extended: false

/* GET users listing. */
router.post('/add', function(req, res, next) { // 新增用户
  console.log(req.body)
  connection.query(sql, function (err, result) {
    // 
  })
});

router.post('/login', function(req, res, next) { // 登录
  let params = req.body.params
  let keyArray = []
  let getBack = {}
  for (prop in params) {  // 找出req.body.params对象的键
    keyArray.push(prop)
  }
  if (keyArray.includes('UserName') && keyArray.includes('UserName')) {  // 判断req.body.params的键是否正确
    connection.query(`${sql.check} where UserName = '${params.UserName}' and PassWord = '${Base64.decode(params.PassWord)}' limit 1;`, function (err, result) {
      if (err) {
        console.log(err)
        return
      }
      if (result.length === 0) {
        getBack.Code = 204
        getBack.Message = '该用户尚未注册！'
        getBack.Data = result
        res.json(getBack)
      } else {
        getBack.Code = 200
        getBack.Message = '登录成功！'
        getBack.Data = result
        res.json(getBack)
      }
    })
  } else {
    res.send('参数错误')
  }
  
})

module.exports = router;
