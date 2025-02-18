import db from "./db.js";

// 查询账户状态
const queryState = (id) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT state FROM user WHERE id = ?`;

        db.query(sqlStr, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 登录
const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT id, username, role, state FROM user WHERE username = ? AND password = ?`;

        db.query(sqlStr, [username, password], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 获取用户列表
const getList = () => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT * FROM user`;

        db.query(sqlStr, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 添加用户
const addUser = (username, password, role, state, comment) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `INSERT INTO user (username, password, role, state, comment) VALUES (?, ?, ?, ?, ?)`;

        db.query(sqlStr, [username, password, role, state, comment], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 更新用户
const putUser = (id, username, password, role, comment) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `UPDATE user SET username = ?, password = ?, role = ?, comment = ? WHERE id = ?`;

        db.query(sqlStr, [username, password, role, comment, id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// 删除用户
const delUser = (id) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `DELETE FROM user WHERE id = ?`;

        db.query(sqlStr, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const userDB = {
    queryState,
    login,
    getList,
    addUser,
    putUser,
    delUser,
};

export default userDB;
