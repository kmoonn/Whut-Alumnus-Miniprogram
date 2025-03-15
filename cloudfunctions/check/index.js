const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js'); // 引入配置文件

cloud.init();

let connection; // 连接池变量

exports.main = async (event, context) => {
  if (event.action === 'getPendingMatches') {
    try {
      connection = await mysql.createConnection(config.MYSQL);
      
      // 获取待审核总数（必须有source_id的记录）
      const [countRows] = await connection.execute(`
        SELECT COUNT(*) as total 
        FROM pending_alumnus 
        WHERE source_id IS NOT NULL 
        AND status = 'pending'
      `);
      
      // 获取一条待审核记录及其对应的源校友信息
      const [rows] = await connection.execute(`
      SELECT
      p.id AS pending_id,
      p.NAME AS pending_name,
      p.gender AS pending_gender,
      p.birthday AS pending_birthday,
      p.graduation_year AS pending_graduation_year,
      p.major AS pending_major,
      p.region AS pending_region,
      p.company AS pending_company,
      p.position AS pending_position,
      p.source,
      s.id AS source_id,
      s.NAME AS source_name,
      s.gender AS source_gender,
      s.birthday AS source_birthday,
      s.graduation_year AS source_graduation_year,
      s.department AS source_department,
      s.major AS source_major,
      s.region AS source_region,
      s.company AS source_company,
      s.position AS source_position 
    FROM
      pending_alumnus p
      INNER JOIN source_alumnus s ON p.source_id = s.id 
    WHERE
      p.source_id IS NOT NULL 
      AND p.STATUS = "pending" 
      LIMIT 1
      `);

      if (rows.length === 0) {
        return {
          code: 200,
          message: '没有待审核数据',
          data: {
            sourceAlumnus: null,
            pendingAlumnus: null,
            pendingCount: 0
          }
        };
      }

      // 分离源校友和待审核校友的数据
      const pendingAlumnus = {
        id:rows[0].pending_id,
        name: rows[0].pending_name,
        gender: rows[0].pending_gender,
        birthday: rows[0].pending_birthday,
        graduation_year: rows[0].pending_graduation_year,
        major: rows[0].pending_major,
        region: rows[0].pending_region,
        company: rows[0].pending_company,
        position: rows[0].pending_position,
        source: rows[0].source
      };

      const sourceAlumnus = {
        id:rows[0].source_id,
        name: rows[0].source_name,
        gender: rows[0].source_gender,
        birthday: rows[0].source_birthday,
        graduation_year: rows[0].source_graduation_year,
        department: rows[0].source_department,
        major: rows[0].source_major,
        region: rows[0].source_region,
        company: rows[0].source_company,
        position: rows[0].source_position
      };

      return {
        code: 200,
        message: '获取成功',
        data: {
          sourceAlumnus,
          pendingAlumnus,
          pendingCount: countRows[0].total
        }
      };

    } catch (err) {
      console.error('数据库查询错误：', err);
      return {
        code: 500,
        message: '服务器错误',
        data: null
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  else if(event.action === 'submitMatch') {
    connection = await mysql.createConnection(config.MYSQL);

    // 参数校验
    if (!event.pendingId || !event.status || !event.reviewerId) {
      return {
        code: 400,
        message: '参数错误',
        data: null
      };
    }

    try {
      // 添加审核记录
      const [updateResult] = await connection.execute(`
        INSERT INTO review_note(
          pending_id, reviewer_id, status
        ) VALUES (?,?,?)
      `, [event.pendingId,event.reviewerId,event.status]);

      if (updateResult.affectedRows === 0) {
        throw new Error('未找到待审核记录');
      }

      return {
        code: 200,
        message: '审核完成'
      };

    } catch (err) {
    
      throw err;
    }
  }
};
