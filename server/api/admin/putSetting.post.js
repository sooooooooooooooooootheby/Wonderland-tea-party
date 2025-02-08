import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { key, value } = body;

    if (!key || value === null) {
        throw createError({
            statusCode: 404,
            message: "key || value 不存在",
        });
    }

    try {
        const results = await userDB.putSetting(key, value);
        const message = results.affectedRows;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
