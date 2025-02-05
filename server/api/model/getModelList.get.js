import modelDB from "~/server/database/model.js";

export default defineEventHandler(async (event) => {
    try {
        const results = await modelDB.getModelList();

        return { results };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "服务器错误" + error,
        });
    }
});