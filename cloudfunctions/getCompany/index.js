const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

// 云函数入口
exports.main = async (event) => {
    
  try {
    const connection = await mysql.createConnection(config.MYSQL);
    const [rows] = await connection.execute(
      'SELECT id, alumni_name, company_name, company_region, company_info FROM company'
    );
    await connection.end();
    if (rows.length === 0) {
      return { code: 404, message: '企业个数为零' };
    }

    return {
      code: 200,
      message: '查询成功',
      result: rows
    };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return { code: 500, message: '服务器错误，请稍后重试' };
  }
};

