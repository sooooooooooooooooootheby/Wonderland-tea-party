import dsChat from "~/server/utils/ds.js";
import qwenChat from "~/server/utils/qwen.js";
import chatDB from "~/server/database/chat.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid, uid, type, model, content } = body;
    const t = await useTranslation(event);

    if (!uuid) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.uuid"),
        });
    }
    if (!uid) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.uid"),
        });
    }
    if (!type) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.ai"),
        });
    }
    if (!model) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.model"),
        });
    }
    if (!content) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.content"),
        });
    }

    const id = content[content.length - 1].id;
    content.unshift({
        role: "system",
        content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
    });
    await chatDB.delMessage(uuid, id);

    const stream = event.node.res;
    stream.setHeader("Content-Type", "text/event-stream");
    stream.setHeader("Cache-Control", "no-cache");
    stream.setHeader("Connection", "keep-alive");

    try {
        let completion = null,
            fullContent = "";

        switch (type) {
            case "deepseek":
                completion = dsChat(model, content);
                for await (const chunk of completion) {
                    fullContent += chunk.choices[0].delta.content;
                    stream.write(`${chunk.choices[0].delta.content}`);
                }
                break;
            case "qwen":
                completion = qwenChat(model, content);
                for await (const chunk of completion) {
                    fullContent += chunk.choices[0].delta.content;
                    stream.write(`${chunk.choices[0].delta.content}`);
                }
                break;
            default:
                throw createError({
                    statusCode: 401,
                    message: t("server.chat.ai"),
                });
        }
        stream.write("[DONE]");
        stream.end();
        await chatDB.saveMessage(uuid, uid, model, "assistant", fullContent);
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.chat.error") + error,
        });
    }
});
