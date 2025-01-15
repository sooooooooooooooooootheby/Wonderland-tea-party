import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid, model, role, content } = body;

    try {
        await chatDB.saveMessage(uuid, model, role, content);
        return { message: "succeed" };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "保存失败",
        });
    }
});
