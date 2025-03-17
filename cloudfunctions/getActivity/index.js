const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

// 云函数入口
exports.main = async (event) => {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(config.MYSQL);

    // 执行 SQL 查询，使用反引号包裹保留关键字
    const [rows] = await connection.execute(
      'SELECT id, title, `describe`, date, image FROM activity'
    );

    // 关闭数据库连接
    await connection.end();

    // 返回成功结果
    return {
      code: 200,
      message: '查询成功',
      result: rows
    };
  } catch (error) {
    // 捕获并打印错误信息
    console.error('数据库查询错误:', error);
    // 返回错误结果
    return { code: 500, message: '服务器错误，请稍后重试' };
  }
};