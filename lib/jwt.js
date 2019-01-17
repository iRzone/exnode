const jwt = require('jsonwebtoken')

const payload = {
  iss: "iRzone.net",
  name: "",
  admin: 0 // true 为管理员 false 为用户
}

const secret = 'wddlzb'

const handleJWT = {
  createToken: (name, jurisdiction) => {
    if (name) {
      payload.name = name
      payload.admin = jurisdiction
      return jwt.sign(payload, secret)
    } else {
      console.log('请设置用户名')
    }
  },
  decodeToken: (token) => {
    return jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return error
      }
      return decoded
    })
  },
  validateToken: (token) => {
    let result = handleJWT.decodeToken(token)
    if (typeof result !== String) {
      if (result.iat > result.iat + 259200) {
        return {
          Code: 401,
          Message: '登录已过期，请重新登录！'
        }
      } else if (result.iss !== 'iRzone.net') {
        return {
          Code: 401,
          Message: '该用户没有授权，请重新登录！'
        }
      } else {
        return {
          Code: 200
        }
      }
    } else {
      return {
        Code: 401,
        Message: '该用户没有授权，请重新登录！'
      }
    }
  }
}

module.exports = handleJWT



