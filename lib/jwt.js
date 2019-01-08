const jwt = require('jsonwebtoken')

const payload = {
  iss: "iRzone.net",
  name: "",
  admin: true
}

const secret = 'wddlzb'

export const createToken = (payload, secret) => {
  if (payload.name) {
    return jwt.sign(payload, secret)
  } else {
    console.log('请设置用户名')
  }
}

export const decodeToken = () => {
  return jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return error
    }
    return decoded
  })
}