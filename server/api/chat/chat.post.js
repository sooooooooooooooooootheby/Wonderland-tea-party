import dsChat from "~/server/utils/ds.js";
import qwenChat from "~/server/utils/qwen.js";
import chatDB from "~/server/database/chat.js";

let cache = null;
let messageList = [];
let system = [
    {
        role: "system",
        content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
    },
];

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid, uid, type, model, content, isNew } = body;
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
    if (isNew === undefined) {
        throw createError({
            statusCode: 401,
            message: t("server.chat.isNew"),
        });
    }

    const stream = event.node.res;
    stream.setHeader("Content-Type", "text/event-stream");
    stream.setHeader("Cache-Control", "no-cache");
    stream.setHeader("Connection", "keep-alive");

    if (uuid === cache) {
        // 继续当前聊天
        messageList.push({ role: "user", content: content });
    } else if (isNew) {
        // 初始化新聊天
        messageList = [...system, { role: "user", content: content }];
        cache = uuid;
    } else {
        messageList = [];
        const m = await chatDB.getChat(uuid);
        m.results.forEach((item) => {
            messageList.push({
                role: item.role,
                content: item.content,
            });
        });
        messageList.push({ role: "user", content: content });
        cache = uuid;
    }

    try {
        let completion = null,
            fullContent = "";

        switch (type) {
            case "deepseek":
                completion = dsChat(model, messageList);
                for await (const chunk of completion) {
                    fullContent += chunk.choices[0].delta.content;
                    stream.write(`${chunk.choices[0].delta.content}`);
                }
                break;
            case "qwen":
                completion = qwenChat(model, messageList);
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

        await chatDB.saveMessage(uuid, uid, model, "user", content);
        await chatDB.saveMessage(uuid, uid, model, "assistant", fullContent);

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
