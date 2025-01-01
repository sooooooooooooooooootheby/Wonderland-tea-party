import mysql from "mysql";
import logger from "../utils/logger.js";

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    charset: process.env.CHARSET,
});

// 插入聊天记录
const saveMessageRecord = (uuid, role, message) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlStr = `INSERT INTO messages_record (uuid, data, role, message) VALUE (?, ?, ?, ?)`;

    db.query(sqlStr, [uuid, timestamp, role, message], (err, results) => {
        if (err) {
            logger.error("插入聊天记录错误:" + err);
        }
    });
};

// 查询聊天列表
const queryMessagesList = () => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT uuid, data, message FROM messages_record WHERE id IN ( SELECT MIN(id) FROM messages_record GROUP BY uuid ) ORDER BY data DESC;`;

        db.query(sqlStr, (err, results) => {
            if (err) {
                logger.error("查询聊天列表错误:" + err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 查询具体聊天记录
const queryMessageRecord = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT role, message FROM messages_record WHERE uuid = ?`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                logger.error("查询具体聊天记录错误:" + err);
                return reject(err);
            }

            if (results.length === 0) {
                return reject("查询失败, 检查uuid是否错误 ");
            }
            resolve(results);
        });
    });
};

// 查询是不是新聊天
const queryIsNewChat = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT * FROM messages_record WHERE uuid = ?`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                logger.error("查询具体聊天记录错误:" + err);
                return reject(err);
            }

            if (results.length === 0) {
                return resolve({ isNewChat: true });
            }
            resolve({ isNewChat: false, results });
        });
    });
};

// 登录
const login = (password) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT id, name FROM user WHERE password = ?`;

        db.query(sqlStr, [password], (err, results) => {
            if (err) {
                logger.error("查询用户密码错误:" + err);
                return reject(err);
            }

            resolve(results);
        });
    });
};

const database = {
    saveMessageRecord,
    queryMessagesList,
    queryMessageRecord,
    queryIsNewChat,
    login,
};

export default database;
