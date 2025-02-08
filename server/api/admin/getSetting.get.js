import userDB from "~/server/database/user.js";

export default defineEventHandler(async (event) => {
    try {
        const user = await userDB.getSetting();

        return { user };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});