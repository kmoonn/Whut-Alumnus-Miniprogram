const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const config = require('config.js');

cloud.init();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { openid } = wxContext
  const db = cloud.database()
  try {
    const result = await db.collection('members').where({
      openid: openid
    }).count()
    if (result.total > 0) {
      return {
        success: true,
        message: '有权限'
      }
    } else {
      return {
        success: false,
        message: '无权限'
      }
    }
  } catch (e) {
    return {
      success: false,
      message: '查询权限失败',
      error: e
    }
  }
}