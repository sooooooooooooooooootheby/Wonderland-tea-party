import OpenAI from "openai";
const config = useRuntimeConfig();

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: config.deepseekKey,
});

const dsChat = async function* (model, messages) {
    const completion = await openai.chat.completions.create({
        messages,
        model,
        stream: true,
    });

    for await (const chunk of completion) {
        yield chunk;
    }
};

export default dsChat;
