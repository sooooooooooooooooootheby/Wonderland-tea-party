import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { uid } = query;

    try {
        const results = await chatDB.getChatList(uid);

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
})