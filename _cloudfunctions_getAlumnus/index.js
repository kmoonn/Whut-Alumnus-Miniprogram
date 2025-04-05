const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

// 云函数入口
exports.main = async (event) => {
  const category = event.category;

  if (category === '%') {
      try {
    const connection = await mysql.createConnection(config.MYSQL);
    const [rows] = await connection.execute(
      'SELECT id, name, position, company FROM famous_alumnus'
    );
    await connection.end();
    

    return {
      code: 200,
      message: '查询成功',
      result: rows
    };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return { code: 500, message: '服务器错误，请稍后重试' };
  }
  }

  else {
      if (!category) {
    return { success: 400, message: '类别不能为空' };
  }

  try {
    const connection = await mysql.createConnection(config.MYSQL);
    const [rows] = await connection.execute(
      'SELECT id, name, position, company FROM famous_alumnus WHERE category = ?',
      [category]
    );
    await connection.end();
    

    return {
      code: 200,
      message: '查询成功',
      result: rows
    };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return { code: 500, message: '服务器错误，请稍后重试' };
  }
  }
};

