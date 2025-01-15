import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { username } = query;

    if (!username) {
        throw createError({
            statusCode: 401,
            message: "用户名不存在",
        });
    }

    try {
        const results = await userDB.getUserInfo(username);

        if (results.length === 0) {
            setResponseStatus(event, 401);
            return {
                message: "找不到用户信息, 请重新登陆",
            };
        }

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
