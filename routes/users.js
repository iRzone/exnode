var express = require('express');
var router = express.Router();
var connection = require('../db')
var Base64 = require('base-64')
var handleJWT = require('../lib/jwt.js')

const sql = {
  add: 'insert into users(ID, UserName, PassWord) values',
  check: 'select * from users'
}

const findUserInfo = (name, pwd) => {
  console.log(pwd)
  return new Promise((resolve, reject) => {
    connection.query(`${sql.check} where UserName = '${name}' limit 1;`, function (error, result) {
      if (error) {
        reject({
          Code: 1000,
          Message: '查询用户信息，数据库操作数出现异常',
        })
      }
      if (result.length === 0) {
        // 数据库中不存在该用户
        resolve({
          Code: 401,
          Message: '该用户尚未注册！'
        });
      } else if (result.length !== 0) {
        result = JSON.stringify(result)
        result = JSON.parse(result)
        console.log(result)
        if (result[0].PassWord === pwd) {
          resolve({
            Code: 200,
            Message: '登录成功！',
            Data: {
              UserName: result[0].UserName,
              ID: result[0].ID,
              Admin: result[0].Admin
            },
            token: handleJWT.createToken(name, result[0].Admin)
          })
        } else {
          reject({
            Code: 401,
            Message: '密码错误！'
          })
        }
      }
    })
  })
}


/* GET users listing. */
router.post('/register', function(req, res, next) { // 新增用户
  let params = req.body.params
  let PassWord = Base64.decode(params.PassWord)
  let getBack = {}
  connection.query(`${sql.add}(null, '${params.UserName}', ${PassWord})`, function (err, result) {
    if (err) {
      console.log(err)
      return
    }
    if (result !== {}){
      getBack.Code = 200
      getBack.Message = '注册成功'
      res.send(getBack)
    }
  })
});

router.post('/login', function(req, res, next) { // 登录
  let params = req.body.params
  let keyArray = []
  let getBack = {
    Data: {}
  }
  for (prop in params) {  // 找出req.body.params对象的键
    keyArray.push(prop)
  }
  if (keyArray.includes('UserName') && keyArray.includes('UserName')) {  // 判断req.body.params的键是否正确
    findUserInfo(params.UserName, Base64.decode(params.PassWord)).then(resolve => {
      res.send(resolve)
    }).catch(e => {
      res.send(e)
    })
    // -------------------------------------------------------------------------
    // connection.query(`${sql.check} where UserName = '${params.UserName}' and PassWord = '${Base64.decode(params.PassWord)}' limit 1;`, function (err, result) {
    //   if (err) {
    //     console.log(err)
    //     return
    //   }
    //   if (result.length === 0) {
    //     getBack.Code = 204
    //     getBack.Message = '该用户尚未注册！'
    //     getBack.Data = result
    //     res.json(getBack)
    //   } else {
    //     result = JSON.stringify(result)
    //     result = JSON.parse(result)
    //     getBack.token = handleJWT.createToken(params.UserName)
    //     // getBack.decodeToken = handleJWT.decodeToken(getBack.token) // 测试解析token
    //     getBack.Code = 200
    //     getBack.Message = '登录成功！'
    //     getBack.Data.UserName = result[0].UserName
    //     getBack.Data.UserID = result[0].ID
    //     res.json(getBack)
    //   }
    // })
  } else {
    res.send('参数错误')
  }
})

module.exports = router;
