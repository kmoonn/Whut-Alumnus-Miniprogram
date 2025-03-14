const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js'); // 引入配置文件

cloud.init();

exports.main = async (event, context) => {
  const { name, gender, graduateYear, college, major, region,company, position } = event;

  if (!name.trim()) {
    return { code: 400, message: '姓名不能为空' };
  }

  // 配置 MySQL 连接
  const connection = await mysql.createConnection(config.MYSQL); // 使用数据库配置

  try {
    // 插入数据
    const sql = `INSERT INTO alumnus_pending (name, gender, graduate_year, college, major, region, company, position) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, gender || null, graduateYear || null, college || null, major || null, region || null, company || null, position || null];

    console.log(values)

    const [result] = await connection.execute(sql, values);
    await connection.end();

    return { code: 200, message: '提交成功', result };
  } catch (error) {
    console.error('数据库错误:', error);
    return { code: 500, message: '数据库写入失败', error };
  }
};
