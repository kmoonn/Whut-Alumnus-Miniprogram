const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js'); // 引入配置文件


cloud.init();

exports.main = async (event, context) => {
  // 配置 MySQL 连接
  const connection = await mysql.createConnection(config.MYSQL); 

  try {
    const sql = `select name, gender, graduate_year, college, major, region, company, position from alumnus where status = 1`;
    
    const [result] = await connection.execute(sql);
    await connection.end();

    return { code: 200, message: '查询成功', result };
  } catch (error) {
    console.error('数据库错误:', error);
    return { code: 500, message: '数据库查询失败', error };
  }
};