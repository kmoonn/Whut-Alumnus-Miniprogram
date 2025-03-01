const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');

cloud.init();

exports.main = async (event, context) => {
  const { action, alumniId, reviewerId, status } = event;
  
  // 连接 MySQL
  const connection = await mysql.createConnection({
    host: '124.223.63.202',      // 你的 MySQL 地址
    user: 'wut815',      // MySQL 用户名
    password: 'zdd.410@K39Y@sct.815', // MySQL 密码
    database: 'whutalumnus_miniprogram', // MySQL 数据库
    port: 3306                    // 端口号，默认为 3306
  });

  try {
    if (action === 'getPending') {
      // 获取待审核数据，未审核过的校友
      const [rows] = await connection.execute(`
        SELECT * FROM alumnus 
        WHERE id NOT IN (SELECT alumni_id FROM alumnus_review WHERE reviewer_id = ?)
        ORDER BY RAND() LIMIT 10
      `, [reviewerId]);

      await connection.end();
      return { code: 200, data: rows };

    } else if (action === 'submitReview') {
      // 检查当前审核人是否已经审核过
      const [existingReview] = await connection.execute(`
        SELECT * FROM alumnus_review WHERE alumni_id = ? AND reviewer_id = ?
      `, [alumniId, reviewerId]);

      if (existingReview.length > 0) {
        await connection.end();
        return { code: 400, message: '您已审核过该校友' };
      }

      // 插入审核记录
      await connection.execute(`
        INSERT INTO alumnus_review (alumni_id, reviewer_id, status, review_time) VALUES (?, ?, ?, NOW())
      `, [alumniId, reviewerId, status]);

      // 更新审核次数
      await connection.execute(`
        UPDATE alumnus SET review_count = review_count + 1 WHERE id = ?
      `, [alumniId]);

      // 计算审核通过情况
      const [reviews] = await connection.execute(`
        SELECT COUNT(*) AS total, SUM(status) AS approved FROM alumnus_review WHERE alumni_id = ?
      `, [alumniId]);

      if (reviews[0].total >= 3) { // 至少 3 个人审核
        const finalStatus = reviews[0].approved >= 2 ? 1 : 0; // 多数通过才算通过
        await connection.execute(`
          UPDATE alumnus SET status = ? WHERE id = ?
        `, [finalStatus, alumniId]);
      }

      await connection.end();
      return { code: 200, message: '审核成功' };
    }

    return { code: 400, message: '无效的 action 参数' };
  } catch (error) {
    console.error('数据库操作失败:', error);
    return { code: 500, message: '操作失败' };
  }
};