import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { uuid } = query;
    const t = await useTranslation(event);

    if (!uuid) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.uuid"),
        });
    }

    try {
        const results = await chatDB.getChat(uuid);

        if (results.length === 0) {
            throw createError({
                statusCode: 404,
                message: t("server.chat.messages"),
            });
        }

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
});
