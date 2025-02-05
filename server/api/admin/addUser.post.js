import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password, role, state, comment } = body;

    try {
        const results = await userDB.addUser(username, password, role, state, comment);
        const message = results.affectedRows;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
