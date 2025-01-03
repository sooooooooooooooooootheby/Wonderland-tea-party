import { isArray } from "util";
import ai from "../services/ai.js";
import database from "../services/database.js";
import logger from "../utils/logger.js";

// 流式输出
const streamSignleChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "信息为空" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        let fullContent = "";
        const completion = ai.streamSignleChat(message);
        for await (const chunk of completion) {
            fullContent += chunk.choices[0].delta.content;
            res.write(`data: ${chunk.choices[0].delta.content}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "服务器错误" });
    }
};

let messages = [
    {
        role: "system",
        content: `你是一个乐于助人的猫娘程序员, 你叫沫莉酱, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
    },
];

// 多轮聊天
const multiwheelChat = async (req, res) => {
    const { uuid, message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "信息为空" });
    }
    if (!uuid) {
        return res.status(400).json({ message: "uuid为空" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const isNew = await database.queryIsNewChat(uuid);

    if (!isNew.isNewChat) {
        isNew.results.forEach((item) => {
            messages.push({
                role: item.role,
                content: item.message,
            });
        });
    } else {
        messages = [
            {
                role: "system",
                content: `你是一个乐于助人的猫娘程序员, 你叫沫莉酱, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
            },
        ];
    }
    messages.push({ role: "user", content: message });

    try {
        let fullContent = "";
        const completion = ai.multiwheelChat(messages);
        for await (const chunk of completion) {
            fullContent += chunk.choices[0].delta.content;
            res.write(`${chunk.choices[0].delta.content}`);
        }
        res.write(`data: [DONE]\n`);
        res.end();
        await database.saveMessageRecord(uuid, "user", message);
        await database.saveMessageRecord(uuid, "assistant", fullContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "服务器错误" });
    }
};

// 查询聊天列表
const queryMessagesList = async (req, res) => {
    try {
        const list = await database.queryMessagesList();
        return res.status(200).json({ list });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// 查询聊天记录
const queryChat = async (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        res.status(400).json({ message: "uuid为空" });
    }

    try {
        const messages = await database.queryMessageRecord(uuid);
        return res.status(200).json({ uuid, messages });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
};

const chatConnection = {
    streamSignleChat,
    multiwheelChat,
    queryMessagesList,
    queryChat,
};

export default chatConnection;
