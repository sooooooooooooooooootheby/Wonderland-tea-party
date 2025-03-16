import dsChat from "~/server/utils/ds.js";
import qwenChat from "~/server/utils/qwen.js";
import chatDB from "~/server/database/chat.js";

let messageList = [];
let system = {
    role: "system",
    content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid, uid, type, model, content, isRea } = body;
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

    const stream = event.node.res;
    stream.setHeader("Content-Type", "text/event-stream");
    stream.setHeader("Cache-Control", "no-cache");
    stream.setHeader("Connection", "keep-alive");

    try {
        const { results } = await chatDB.getChatChat(uuid);
        messageList.push(system, ...results.map(({ role, content }) => ({ role, content })), {
            role: "user",
            content: content,
        });
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.chat.error") + error,
        });
    }

    try {
        let completion = null,
            fullContent = "",
            fullReasoningContent = "";

        switch (type) {
            case "deepseek":
                completion = dsChat(model, messageList);
                break;
            case "qwen":
                completion = qwenChat(model, messageList);
                break;
            default:
                throw createError({
                    statusCode: 401,
                    message: t("server.chat.ai"),
                });
        }

        for await (const chunk of completion) {
            const { content, reasoning_content } = chunk.choices[0].delta;

            if (content === null) {
                fullReasoningContent += reasoning_content;
                stream.write(`[REASONING]${reasoning_content}`);
            } else {
                fullContent += fullContent;
                stream.write(`[CONTENT]${content}`);
            }
        }

        await chatDB.saveMessage(uuid, uid, model, "user", content);
        if (isRea) {
            await chatDB.saveMessage(uuid, uid, model, "reasoning", fullReasoningContent);
        }
        await chatDB.saveMessage(uuid, uid, model, "assistant", fullContent);

        fullContent = "";
        fullReasoningContent = "";

        stream.write("[DONE]");
        stream.end();
    } catch (error) {
        await chatDB.saveMessage(uuid, uid, model, "user", content);
        await chatDB.saveMessage(uuid, uid, model, "assistant", t("server.chat.error") + error);

        throw createError({
            statusCode: 500,
            message: t("server.chat.error") + error,
        });
    }
});
