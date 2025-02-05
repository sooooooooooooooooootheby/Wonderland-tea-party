import { defineStore } from "pinia";
import { message } from "ant-design-vue";
import date from "s22y-utils";
import { useModelStore } from "./modelStore.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

let openai;

const multiwheelChat = async function* (messages, type, model, key) {
    const config = {
        tyqw: {
            apiKey: key,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
            dangerouslyAllowBrowser: true,
        },
        github: {
            apiKey: key,
            baseURL: "https://models.inference.ai.azure.com",
            dangerouslyAllowBrowser: true,
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
        const chunks = [];
        for await (const chunk of response) {
            chunks.push(chunk);
        }
        for (let i = 1; i < chunks.length - 1; i++) {
            yield chunks[i];
        }
    } else {
        for await (const chunk of response) {
            yield chunk;
        }
    }
};

export const useChatStore = defineStore("chat", {
    state: () => ({
        isAwaitChatList: true,
        chatList: [],
        isAwaitChat: true,
        chat: [
            {
                role: "system",
                content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
            },
        ],
        isAwaitAnswer: false,
        isNewChat: false,
        dashScopeApiKey: null,
        githubApiKey: null,
    }),
    actions: {
        // 获取聊天列表
        async getChatList() {
            try {
                const response = await $fetch(`/api/chat/getChatList?uid=${localStorage.getItem("uid")}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                let list = response.results;
                for (let i = 0; i < response.results.length; i++) {
                    list[i].data = date.handleDate("text", response.results[i].data);
                }

                const groupedChatList = Object.values(
                    list.reduce((acc, item) => {
                        const dateKey = item.data;
                        if (!acc[dateKey]) {
                            acc[dateKey] = { date: dateKey, items: [] };
                        }
                        acc[dateKey].items.push(item);
                        return acc;
                    }, {})
                );

                groupedChatList.sort((a, b) => new Date(b.date) - new Date(a.date));
                this.chatList = groupedChatList;
                this.isAwaitChatList = false;
            } catch (error) {
                console.error(error);
                message.error(error.response._data.message);
            }
        },
        // 获取聊天信息
        async getChat(uuid) {
            try {
                const response = await $fetch(`/api/chat/getChat?uuid=${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                for (let i = 0; i < response.results.length; i++) {
                    this.chat.push(response.results[i]);
                }
                const model = useModelStore();
                const models = response.results[response.results.length - 1].model;
                const foundModel = model.modelList.find((item) => item.model === models);

                if (foundModel) {
                    model.selectedModel = { ...foundModel };
                }

                this.isAwaitChat = false;
            } catch (error) {
                console.error(error);
                message.error(error.response._data.message);
            }
        },
        // 聊天
        async sendMessage(uuid, input) {
            if (!input) {
                return message.error("你还没有输入!😿");
            }
            if (this.isAwaitAnswer) {
                return message.warning("慢一点, 受不了了 🙀");
            }

            this.isAwaitAnswer = true;

            const uid = localStorage.getItem("uid");
            const model = useModelStore();
            const type = model.selectedModel.type;
            const models = model.selectedModel.model;
            this.chat.push({
                id: null,
                model: models,
                role: "user",
                content: input,
            });
            this.chat.push({
                id: null,
                model: models,
                role: "assistant",
                content: "",
            });
            const token = localStorage.getItem("token");

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000);
                const response = await fetch(`/api/chat/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        uid: uid,
                        type: type,
                        model: models,
                        uuid: uuid,
                        content: input,
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    let chunkText = decoder.decode(value, { stream: true });

                    if (chunkText === "[DONE]") {
                        return (this.isAwaitAnswer = false);
                    }
                    this.chat[this.chat.length - 1].content += chunkText;
                }
            } catch (error) {
                message.error("回复出错:" + error);
                console.error("回复出错:" + error);
            }
            this.isAwaitAnswer = false;
        },
        // 创建新的聊天
        async createNewChat(input) {
            this.isNewChat = true;
            const uuid = uuidv4();
            await navigateTo(`/c/${uuid}`);

            let todayChat = this.chatList.find((item) => item.date === "今天");
            if (!todayChat) {
                todayChat = {
                    date: "今天",
                    items: [
                        {
                            uuid: uuid,
                            data: "今天",
                            content: input,
                        },
                    ],
                };
                this.chatList.unshift(todayChat);
                await this.sendMessage(uuid, input);
                this.isNewChat = false;
            } else {
                const item = {
                    uuid: uuid,
                    data: "今天",
                    content: input,
                };

                todayChat.items.unshift(item);
                await this.sendMessage(uuid, input);
                this.isNewChat = false;
            }
        },
    },
});
