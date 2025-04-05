const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

exports.main = async (event) => {
  const { id } = event;

  if (!id) {
    return {
      code: 400,
      message: '缺少 id 参数',
      result: {}
    };
  }

  let connection;
  try {
    connection = await mysql.createConnection(config.MYSQL);
    const [rows] = await connection.execute(
      'SELECT category, name, region, company, position, graduation_year, major FROM famous_alumnus WHERE id =?',
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return {
        code: 404,
        message: '未找到对应的校友信息',
        result: {}
      };
    }

    // 直接返回第一条记录
    return {
      code: 200,
      message: '查询成功',
      result: rows[0]
    };
  } catch (error) {
    console.error('数据库查询出错:', error);
    return {
      code: 500,
      message: `数据库查询失败: ${error.message}`,
      result: {}
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};