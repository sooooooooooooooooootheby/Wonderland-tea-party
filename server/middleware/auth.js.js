import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    if (!event._path.includes("/api") || event._path.includes(("/api/user/login"))) {
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
        const decoded = jwt.verify(token, process.env.TOEKNKEY);

        event.context.user = decoded;
    } catch (error) {
        throw createError({
            statusCode: 401,
            message: "无效或过期 Token, 请重新登陆",
        });
    }
});
