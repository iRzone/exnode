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
  }
}

module.exports = handleJWT



