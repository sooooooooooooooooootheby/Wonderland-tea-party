import db from "./db.js";

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

const getUserInfo = (username) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT id, username, role FROM user WHERE username = ?`;

        db.query(sqlStr, [username], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const getUserList = () => {
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

const userDB = {
    login,
    getUserInfo,
    getUserList,
    putUser,
    queryState,
    delUser,
    addUser
};

export default userDB;
