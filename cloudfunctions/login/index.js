// 云函数入口文件
const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('config.js'); // 引入配置文件

cloud.init();

let connection; // 连接池变量

// 云函数入口
exports.main = async (event, context) => {
  const { username, password } = event;

  if (!username || !password) {
    return { success: false, message: '学工号和密码不能为空' };
  }

  try {
    // 确保 MySQL 连接只初始化一次
    if (!connection) {
      connection = await mysql.createConnection(config.MYSQL);
    }

    // 查询数据库
    const [rows] = await connection.execute(
      'SELECT id, username, password, role FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = rows[0];

    // 校验密码
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: '密码错误' };
    }

    // 返回用户信息（不包括密码）
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return { success: false, message: '服务器错误，请稍后重试' };
  }
};