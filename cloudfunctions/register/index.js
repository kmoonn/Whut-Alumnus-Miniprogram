const cloud = require('wx-server-sdk');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('config.js');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

let connection;

exports.main = async (event, context) => {
    const { username, password, nickname } = event;

    if (!nickname || !username || !password) {
        return { success: false, message: '任何一项不能为空!' };
    }

    try {
        if (!connection) {
            connection = await mysql.createConnection(config.MYSQL);
        }

        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            return { success: false, message: '该用户名已被注册' };
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const [result] = await connection.execute(
            'INSERT INTO users (nickname, username, password) VALUES (?, ?, ?)',
            [nickname, username, hashPassword]
        );

        await connection.end();

        if (result.affectedRows === 1) {
            return {
                success: true,
                message: '注册成功'
            };
        } else {
            return {
                success: false,
                message: '注册失败，请稍后重试'
            };
        }
    } catch (err) {
        console.error('数据库错误:', err);
        return {
            success: false,
            message: '注册失败，请稍后重试'
        };
    }
};