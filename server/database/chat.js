import db from "./db.js";

// 获取聊天记录
const getChat = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT * FROM messages_record WHERE uuid = ?`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve({ results });
        });
    });
};

// 获取聊天记录(聊天时)
const getChatChat = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT role, content FROM messages_record WHERE uuid = ? AND role != 'reasoning'`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve({ results });
        });
    });
}

// 插入聊天记录
const saveMessage = async (uuid, uid, model, role, content) => {
    return new Promise((resolve, reject) => {
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
            const sqlStr = `INSERT INTO messages_record (uuid, uid, model, data, role, content) VALUES (?, ?, ?, ?, ?, ?)`;

            db.query(sqlStr, [uuid, uid, model, timestamp, role, content], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// 获取聊天列表
const getList = (uid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT uuid, data, content FROM messages_record WHERE id IN ( SELECT MIN(id) FROM messages_record GROUP BY uuid ) AND uid = ? ORDER BY data DESC;`;

        db.query(sqlStr, [uid], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 获取聊天记录
const getMessages = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT id, model, role, content FROM messages_record WHERE uuid = ?`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 删除指定消息
const delMessage = (uuid, id) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `DELETE FROM messages_record WHERE uuid = ? AND id >= ?;`;

        db.query(sqlStr, [uuid, id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 删除聊天记录
const delChat = (uuid) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `DELETE FROM messages_record WHERE uuid = ?;`;

        db.query(sqlStr, [uuid], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const chatDB = {
    getChat,
    getChatChat,
    saveMessage,
    getList,
    getMessages,
    delMessage,
    delChat
};

export default chatDB;
