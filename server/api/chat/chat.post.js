import OpenAI from "openai";
import chatDB from "~/server/database/chat.js";

let openai;
let messages = [
    {
        role: "system",
        content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
    },
];

const multiwheelChat = async function* (messages, type, model) {
    const config = {
        tyqw: {
            apiKey: useRuntimeConfig().dashScopeApiKey,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        },
        github: {
            apiKey: useRuntimeConfig().githubApiKey,
            baseURL: "https://models.inference.ai.azure.com",
        },
    };

    if (config[type]) {
        openai = new OpenAI(config[type]);
    } else {
        throw new Error(`Unsupported type: ${type}`);
    }

    const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: true,
    });

    if (type === "github") {
        for await (const part of response) {
            yield part;
        }
    } else {
        for await (const chunk of response) {
            yield chunk;
        }
    }
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { uuid, uid, content, type, model } = body;
    const stream = event.node.res;

    if (!uuid) {
        throw createError({
            statusCode: 401,
            message: "uuid为空",
        });
    }
    if (!content) {
        throw createError({
            statusCode: 401,
            message: "消息为空",
        });
    }
    if (!type) {
        throw createError({
            statusCode: 401,
            message: "ai类型为空",
        });
    }
    if (!model) {
        throw createError({
            statusCode: 401,
            message: "模型为空",
        });
    }

    stream.setHeader("Content-Type", "text/event-stream");
    stream.setHeader("Cache-Control", "no-cache");
    stream.setHeader("Connection", "keep-alive");

    const isNew = await chatDB.queryIsNewChat(uuid);

    if (isNew.results.length !== 0) {
        isNew.results.forEach((item) => {
            messages.push({
                role: item.role,
                content: item.content,
            });
        });
    }

    messages.push({ role: "user", content: content });

    try {
        let fullContent = "";
        const completion = multiwheelChat(messages, type, model);
        if (type === "github") {
            for await (const part of completion) {
                fullContent += part.choices[0]?.delta?.content || "";
                stream.write(`${part.choices[0]?.delta?.content || ""}`);
            }
        } else {
            for await (const chunk of completion) {
                fullContent += chunk.choices[0].delta.content;
                stream.write(`${chunk.choices[0].delta.content}`);
            }
        }

        stream.write("[DONE]");
        stream.end();
        await chatDB.saveMessage(uuid, uid, model, "user", content);
        await chatDB.saveMessage(uuid, uid, model, "assistant", fullContent);
    } catch (error) {
        throw createError({
            statusCode: 505,
            message: "服务器错误" + error,
        });
    }
});
