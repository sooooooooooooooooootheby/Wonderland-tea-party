import jwt from "jsonwebtoken";
import userDB from "~/server/database/user.js";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (!event._path.includes("/api") || event._path.includes("/api/user/login")) {
        return;
    }

    const token = event.req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        throw createError({
            statusCode: 401,
            message: "Token 不存在",
        });
    }

    try {
        const decoded = jwt.verify(token, config.tokenKey);

        const results = await userDB.queryState(decoded.id);
        if (results[0].state === "stop") {
            setResponseStatus(event, 403);
            return {
                message: "账户已被停用",
            };
        }

        event.context.user = decoded;
    } catch (error) {
        throw createError({
            statusCode: 401,
            message: "无效或过期 Token, 请重新登陆" + error,
        });
    }
});
