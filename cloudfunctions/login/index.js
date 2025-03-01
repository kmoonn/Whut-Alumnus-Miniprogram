// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 引入数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { username, password } = event

  // 查询数据库中的用户
  try {
    const res = await db.collection('users').where({
      username: username
    }).get()

    if (res.data.length === 0) {
      return {
        success: false,
        message: '学工号不存在'
      }
    }

    const user = res.data[0]

    // 检查密码是否匹配
    if (user.password !== password) {
      return {
        success: false,
        message: '密码错误'
      }
    }

    // 登录成功
    return {
      success: true,
      message: '登录成功',
      userInfo: user
    }

  } catch (err) {
    return {
      success: false,
      message: '数据库查询失败',
      error: err
    }
  }
}
