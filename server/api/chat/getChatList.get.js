import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    try {
        const results = await chatDB.getChatList();

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
})