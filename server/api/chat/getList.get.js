import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { uid } = query;
    const t = await useTranslation(event);

    if (!uid) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.uid"),
        });
    }

    try {
        const results = await chatDB.getList(uid);

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
});
