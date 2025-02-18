import db from "./db.js";

// 获取模型列表
const getList = () => {
    return new Promise((resolve, reject) => {
        const sqlStr = `SELECT * from model`;

        db.query(sqlStr, (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);
        });
    });
};

// 添加模型
const addModel = (display, type, model, icon, info, state) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `INSERT INTO model (display, type, model, icon, info, state) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sqlStr, [display, type, model, icon, info, state], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

// 更新模型
const putModel = (id, display, type, model, icon, info, state) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `UPDATE model SET display = ?, type = ?, model = ?, icon = ?, info = ?, state = ? WHERE id = ?`;

        db.query(sqlStr, [display, type, model, icon, info, state, id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

// 删除模型
const delModel = (id) => {
    return new Promise((resolve, reject) => {
        const sqlStr = `DELETE FROM model WHERE id = ?`;

        db.query(sqlStr, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const modelDB = {
    getList,
    addModel,
    putModel,
    delModel
}

export default modelDB;