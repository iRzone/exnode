var express = require('express');
var router = express.Router();
var connection = require('../db')
var Base64 = require('js-base64').Base64
var handleJWT = require('../lib/jwt.js')
var validateKey = require('../lib/validate.js')

const sql = {
  add: 'insert into users(ID, UserName, PassWord, Admin, Avatar) values',
  check: 'select * from users',
  update: 'update users set'
}

// 登录验证
const findUserInfo = (name, pwd) => {
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
          Code: 204,
          Message: '该用户尚未注册！'
        });
      } else if (result.length !== 0) {
        result = JSON.stringify(result)
        result = JSON.parse(result)
        if (result[0].PassWord === pwd) {
          let avatar = JSON.parse(result[0].Avatar)
          resolve({
            Code: 200,
            Message: '登录成功！',
            Data: {
              UserName: result[0].UserName,
              ID: result[0].ID,
              Admin: result[0].Admin,
              Avatar: {
                delete: avatar.delete,
                path: avatar.path
              }
            },
            token: handleJWT.createToken(name, result[0].Admin)
          })
        } else {
          reject({
            Code: 202,
            Message: '密码错误！'
          })
        }
      }
    })
  })
}

// 注册验证
const validateSignIn = (name, pwd) => {
  return new Promise((resolve, reject) => {
    let avatar = JSON.stringify({"delete":"https://sm.ms/delete/Bk9HPSbeCa7ryVU","filename":"iRzoneAvatar.jpg","hash":"Bk9HPSbeCa7ryVU","height":165,"ip":"219.132.205.32","path":"/2019/02/15/5c66553f72c2d.jpg","size":56826,"storename":"5c66553f72c2d.jpg","timestamp":1550210367,"url":"https://i.loli.net/2019/02/15/5c66553f72c2d.jpg","width":165})
    connection.query(`${sql.check} where UserName = '${name}' limit 1;`, function (error, result) {
      if (error) {
        reject({
          Code: 1000,
          Message: '用户注册 - 数据库操作数出现异常',
        })
      }
      if (result.length === 1) {
        reject({
          Code: 201,
          Message: '用户已存在'
        })
      } else {
        connection.query(`${sql.add} (null, '${name}', '${pwd}', 0, '${avatar}');`, function (err, res) {
          if (err) {
            console.log(err)
          }
          if (Object.keys(res).length !== 0) {
            resolve({
              Code: 200,
              Message: '注册成功！'
            })
          }
        })
      }
    })
  })
}

// 获取用户列表
const getUsersList = () => {
  return new Promise((resolve, reject) => {
    connection.query(`${sql.check};`, function (error, result){
      if (error) {
        reject({
          Code: 1000,
          Message: '获取用户列表 - 数据库操作数出现异常',
        })
      }
      if (result.length !== 0) {
        result.forEach(item => {
          delete item.PassWord
        })
        resolve({
          Code: 200,
          Data: result
        })
      }
    })
  })
}

// 更新用户信息
const updateMessage = (id, name, avatar) => {
  return new Promise((resolve, reject) => {
    connection.query(`${sql.check} where UserName = '${name}' limit 1;`, function (error, result) {
      if (error) {
        reject({
          Code: 1000,
          Message: '修改用户信息 - 查询数据库操作数出现异常',
        })
      }
      if (result.length !== 0) {
        result = JSON.parse(JSON.stringify(...result))
        if (id !== result.ID) { // 判断是否是同一用户，不是的话提示用户名已存在
          reject({
            Code: 202,
            Message: '用户名已存在'
          })
        } else {
          connection.query(`${sql.update} Avatar = '${avatar}' where ID = ${id};`, function (err, res) {
            if (err) {
              reject({
                Code: 1000,
                Message: '修改用户信息 - 数据库操作数出现异常',
              })
            }
            if (res.length !== 0) {
              res = JSON.parse(JSON.stringify(res))
              resolve({
                Code: 200,
                Message: '修改成功！'
              })
            }
          })
        }
      } else {
        connection.query(`${sql.update} UserName = '${name}', Avatar = '${avatar}' where ID = ${id};`, function (err, res) {
          if (err) {
            reject({
              Code: 1000,
              Message: '修改用户信息 - 数据库操作数出现异常',
            })
          }
          if (res.length !== 0) {
            resolve({
              Code: 200,
              Message: '修改成功！'
            })
          }
        })
      }
    })
  })
}

/* users listing. */
router.post('/register', function(req, res, next) { // 注册
  let params = req.body.params
  let validate = validateKey(['UserName', 'PassWord'], params)
  if (validate.Code) {
    let PassWord = Base64.decode(params.PassWord)
    validateSignIn(params.UserName, PassWord).then(resolve => {
      res.json(resolve)
    }).catch(error => {
      res.json(error)
    })
  } else {
    res.send(validate.Message)
  }
  // -------------------------------------------------------------------------
  // connection.query(`${sql.add}(null, '${params.UserName}', ${PassWord})`, function (err, result) {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   if (result !== {}){
  //     getBack.Code = 200
  //     getBack.Message = '注册成功'
  //     res.send(getBack)
  //   }
  // })
})

router.post('/login', function(req, res, next) { // 登录
  let params = req.body.params
  let validate = validateKey(['UserName', 'PassWord'], params)
  if (validate.Code) {  // 判断req.body.params的键是否正确
    findUserInfo(params.UserName, Base64.decode(params.PassWord)).then(resolve => {
      res.json(resolve)
    }).catch(e => {
      res.json(e)
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
    res.send(validate.Message)
  }
})

router.get('/list', function(req, res, next) {
  let result = handleJWT.validateToken(req.headers.authorization)
  if (result.Code === 200) {
    getUsersList().then(resolve => {
      res.json(resolve)
    }).catch(reject => {
      res.json(reject)
    })
  } else {
    res.json(result)
  }
})

// 参数：ID、UserName、Avatar
router.post('/update', function (req, res, next) {
  let result = handleJWT.validateToken(req.headers.authorization)
  let params = req.body
  let validate = validateKey(['ID', 'UserName', 'Avatar'], params)
  if (validate.Code) {
    if (result.Code === 200) {
      updateMessage(params.ID, params.UserName, params.Avatar).then(resolve => {
        res.json(resolve)
      }).catch(reject => {
        res.json(reject)
      })
    } else {
      res.json(result)
    }
  } else {
    res.send(validate.Message)
  }
})

module.exports = router;
