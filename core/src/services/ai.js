import OpenAI from "openai";
import database from "./database.js";

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const streamSignleChat = async function* (message) {
    const response = await openai.chat.completions.create({
        model: "qwen-plus",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
        ],
        stream: true,
    });

    for await (const chunk of response) {
        yield chunk;
    }
};

const multiwheelChat = async (uuid, message, messages) => {
    async function getResponse(messages) {
        try {
            const completion = await openai.chat.completions.create({
                model: "qwen-plus",
                messages: messages,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Error fetching response:", error);
            throw error;
        }
    }

    let status = 0;
    let content = "";

    await (async () => {
        messages.push({ role: "user", content: message });
        database.saveMessageRecord(uuid, "user", message);
        try {
            const response = await getResponse(messages);
            content = response;
            messages.push({ role: "assistant", content });
            database.saveMessageRecord(uuid, "assistant", content);
            status = 200;
        } catch (error) {
            status = 500;
            content = "获取响应时发生错误:" + error;
        }
    })();

    return { status, content };
};

const ai = {
    streamSignleChat,
    multiwheelChat,
};

export default ai;
