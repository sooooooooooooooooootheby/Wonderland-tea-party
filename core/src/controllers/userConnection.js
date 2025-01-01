import database from "../services/database.js";
import sha256 from "crypto-js/sha256.js";
import Base64 from "crypto-js/enc-base64.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(200).json({ code: 1, message: "密码为空" });
    }

    let saltPassword = password + "typhon";
    saltPassword = Base64.stringify(sha256(saltPassword));

    try {
        const results = await database.login(saltPassword);
        if (results.length !== 0) {
            const token = jwt.sign({ name: results[0].name, id: results[0].id }, process.env.TOEKNKEY, {
                expiresIn: process.env.TOKENOUTTIME,
            });
            res.status(200).json({ code: 1, results, token });
        } else {
            res.status(200).json({ code: 0, message: "密码错误" });
        }
    } catch (error) {
        res.status(500).json({ code: 0, message: "服务器出错" });
    }
};

const userConnection = {
    login,
};

export default userConnection;
