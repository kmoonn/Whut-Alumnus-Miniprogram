const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');

cloud.init();

exports.main = async (event, context) => {
  const { name, gender, graduateYear, college, major, company, position } = event;

  if (!name.trim()) {
    return { code: 400, message: '姓名不能为空' };
  }

  // 配置 MySQL 连接
  const connection = await mysql.createConnection({
    host: '124.223.63.202',      // 你的 MySQL 地址
    user: 'wut815',      // MySQL 用户名
    password: 'zdd.410@K39Y@sct.815', // MySQL 密码
    database: 'whutalumnus_miniprogram', // MySQL 数据库
    port: 3306                    // 端口号，默认为 3306
  });

  try {
    // 插入数据
    const sql = `INSERT INTO alumnus (name, gender, graduate_year, college, major, company, position) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, gender || null, graduateYear || null, college || null, major || null, company || null, position || null];

    const [result] = await connection.execute(sql, values);
    await connection.end();

    return { code: 200, message: '提交成功', result };
  } catch (error) {
    console.error('数据库错误:', error);
    return { code: 500, message: '数据库写入失败', error };
  }
};
