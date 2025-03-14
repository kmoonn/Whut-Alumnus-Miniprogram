const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js'); // 引入配置文件

cloud.init();

let connection; // 连接池变量


exports.main = async (event, context) => {
  const { action, reviewerId, alumniId, searchId, status } = event;

  try {
    // 确保 MySQL 连接只初始化一次
    if (!connection) {
      connection = await mysql.createConnection(config.MYSQL);
    }

    if (action === 'getPendingMatches') {
      // 查询待审核的匹配信息
      const [matches] = await connection.execute(
        `SELECT alumni_id, search_id FROM alumnus_application WHERE status = 0 LIMIT 10`
      );

      if (matches.length === 0) {
        connection.release();
        return { code: 404, message: '暂无待匹配数据', data: {} };
      }

      // 获取第一条匹配数据的详细信息
      const alumniId = matches[0].alumni_id;
      const searchId = matches[0].search_id;

      const [alumniInfo] = await connection.execute(
        `SELECT * FROM alumni WHERE id = ?`,
        [alumniId]
      );
      
      const [searchInfo] = await connection.execute(
        `SELECT * FROM search_records WHERE id = ?`,
        [searchId]
      );

      connection.release();

      return {
        code: 200,
        message: '获取成功',
        data: {
          alumniInfo: alumniInfo.length > 0 ? alumniInfo[0] : null,
          searchInfo: searchInfo.length > 0 ? searchInfo[0] : null,
          count: matches.length
        }
      };
    }

    if (action === 'submitMatch') {
      if (!alumniId || !searchId || typeof status !== 'number') {
        return { code: 400, message: '参数错误' };
      }

      // 更新匹配状态
      await connection.execute(
        `UPDATE pending_matches SET status = ?, reviewer_id = ?, reviewed_at = NOW() WHERE alumni_id = ? AND search_id = ?`,
        [status, reviewerId, alumniId, searchId]
      );
      
      connection.release();

      return { code: 200, message: '提交成功' };
    }

    connection.release();
    return { code: 400, message: '无效的 action' };
  } catch (error) {
    console.error(error);
    return { code: 500, message: '服务器错误', error };
  }
};
