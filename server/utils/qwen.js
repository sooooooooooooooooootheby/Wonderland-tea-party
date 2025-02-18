import OpenAI from "openai";
const config = useRuntimeConfig();

const openai = new OpenAI({
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: config.qwenKey,
});

const qwenChat = async function* (model, messages) {
    const completion = await openai.chat.completions.create({
        messages,
        model,
        stream: true,
    });

    for await (const chunk of completion) {
        yield chunk;
    }
};

export default qwenChat;
