import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { uuid } = query;

    if (!uuid) {
        throw createError({
            statusCode: 401,
            message: "uuid不存在",
        });
    }

    try {
        const results = await chatDB.getChat(uuid);

        if (results.length === 0) {
            throw createError({
                statusCode: 404,
                message: "找不到聊天记录",
            });
        }

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});
