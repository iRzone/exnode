// 验证传进来的参数 - 键

/**
 * @method validateKey
 * @param {Array} validateArr 用于判断前端请求的键
 * @param {Array} reqArr 前端请求的键
 */

const validateKey = (validateArr, params) => {
  let arr = []
  let reqArr = []
  for (prop in params) {  // 找出req.body.params对象的键
    reqArr.push(prop)
  }
  let valen = validateArr.length
  let reqlen = reqArr.length
  if (valen === reqlen) {
    reqArr.forEach(item => {
      arr.push(validateArr.includes(item))
    })
    if (arr.includes(false)) {
      return {
        Code: false,
        Message: '参数错误'
      }
    } else {
      return {
        Code: true
      }
    }
  } else {
    return {
      Code: false,
      Message: '缺少参数'
    }
  }
}

module.exports = validateKey
