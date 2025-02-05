import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, username, password, role, state, comment } = body;

    if (!id) {
        throw createError({
            statusCode: 404,
            message: "id 不存在",
        });
    }

    try {
        const results = await userDB.putUser(id, username, password, role, state, comment);
        const message = results.message;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
