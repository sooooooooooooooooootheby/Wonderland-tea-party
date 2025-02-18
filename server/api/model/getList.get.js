import modelDB from "~/server/database/model.js";

export default defineEventHandler(async (event) => {
    const t = await useTranslation(event);

    try {
        const results = await modelDB.getList();

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
});
