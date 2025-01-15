import db from "./db.js";

// 获取模型列表
const getModelList = () => {
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

const modelDB = {
    getModelList,
}

export default modelDB;