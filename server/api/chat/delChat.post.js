import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid } = body;
    const t = await useTranslation(event);

    if (!uuid) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.uuid"),
        });
    }

    try {
        const results = await chatDB.delChat(uuid);

        if (results.affectedRows === 0) {
            return { result: false };
        } else {
            return { result: true };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
});
