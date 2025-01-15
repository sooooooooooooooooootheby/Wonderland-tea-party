import db from "./db.js";

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT id, username, avatar, role FROM user WHERE username = ? AND password = ?`;

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
        const sqlStr = `SELECT id, username, avatar, role FROM user WHERE username = ?`;

        db.query(sqlStr, [username], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const userDB = {
    login,
    getUserInfo,
};

export default userDB;
