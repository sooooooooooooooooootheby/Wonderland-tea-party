import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;

    if (!id) {
        throw createError({
            statusCode: 404,
            message: "id 不存在",
        });
    }

    try {
        const results = await userDB.delUser(id);
        const message = results.affectedRows;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
