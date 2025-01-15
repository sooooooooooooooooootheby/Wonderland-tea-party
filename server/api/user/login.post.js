import userDB from "~/server/database/user.js";
import jwt from "jsonwebtoken";
import encryption from "s22y-utils";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({
            statusCode: 401,
            message: "用户名或密码不存在",
        });
    }

    let saltPassword = encryption.passwordHash(password, "typhon");

    try {
        const results = await userDB.login(username, saltPassword);

        if (results.length === 0) {
            setResponseStatus(event, 401);
            return {
                message: "用户名或密码错误",
            };
        }
        const token = jwt.sign({ name: results[0].name, id: results[0].id, role: results[0].role }, process.env.TOEKNKEY, {
            expiresIn: process.env.TOKENOUTTIME,
        });
        return {
            message: "登录成功",
            username: username,
            token: token,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
