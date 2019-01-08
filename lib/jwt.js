const jwt = require('jsonwebtoken')

const payload = {
  iss: "iRzone.net",
  name: "",
  admin: true
}

const secret = 'wddlzb'

const handleJWT = {
  createToken: (name) => {
    if (name) {
      payload.name = name
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



