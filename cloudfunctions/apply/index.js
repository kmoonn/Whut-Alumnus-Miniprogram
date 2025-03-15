const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

exports.main = async (event, context) => {
  const { 
    category,
    name, 
    region, 
    company, 
    position, 
    graduation_year, 
    major
  } = event;

  // 输入验证

  if (!category || category.length === 0) {
    return { code: 400, message: '请至少选择一个类别' };
  }

  if (!name.trim()) {
    return { code: 400, message: '姓名不能为空' };
  }
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(config.MYSQL);

    // 插入主表数据
    const sql = `
      INSERT INTO pending_alumnus (
        category,
        name, 
        region, 
        company, 
        position,
        graduation_year, 
        major
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      category.join(','), // 将类别数组转换为逗号分隔的字符串
      name,
      region || null,
      company || null,
      position || null,
      graduation_year || null,
      major || null
    ];

    console.log('插入数据:', values);

    const [result] = await connection.execute(sql, values);

    return { 
      code: 200, 
      message: '提交成功', 
      data: {
        id: result.insertId
      }
    };

  } catch (error) {
    console.error('数据库错误:', error);
    return { 
      code: 500, 
      message: '提交失败，请稍后重试', 
      error: error.message 
    };

  } finally {
    // 确保关闭数据库连接
    if (connection) {
      await connection.end();
    }
  }
};