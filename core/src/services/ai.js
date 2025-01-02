import OpenAI from "openai";

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

const multiwheelChat = async function* (messages) {
    const response = await openai.chat.completions.create({
        model: "qwen-plus",
        messages: messages,
        stream: true,
    });

    for await (const chunk of response) {
        yield chunk;
    }
}

const ai = {
    streamSignleChat,
    multiwheelChat,
};

export default ai;
