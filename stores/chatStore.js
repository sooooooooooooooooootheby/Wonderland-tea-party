import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";

const handleDate = (date, t) => {
    const now = new Date();
    const input = new Date(date);

    const day = Math.floor((now.getTime() - input.getTime()) / (1000 * 60 * 60 * 24));

    if (day === 0) {
        return `${t("client.sider.time.today")}`;
    } else if (day === 1) {
        return `${t("client.sider.time.yesterday")}`;
    } else {
        return `${day} ${t("client.sider.time.day")}${t("client.sider.time.ago")}`;
    }
};

const analysisToken = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT");
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decodedPayload);

    return data;
};

export const useChatStore = defineStore("chat", {
    state: () => ({
        chatList: [],
        chat: [],

        isChatList: false,
        isAwaitAnswerStart: false,
        isAwaitAnswer: false,
        isNewChat: false,
    }),
    actions: {
        async getList() {
            const { $fetch } = useNuxtApp();
            const { t } = useI18n();

            try {
                const response = await $fetch(`/api/chat/getList?uid=${localStorage.getItem("uid")}`);
                let list = response.results;
                for (let i = 0; i < response.results.length; i++) {
                    list[i].data = handleDate(response.results[i].data, t);
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
                this.isChatList = true;
            } catch (error) {
                console.log(error);
                message.error(t("client.store.chat.error1") + error);
            }
        },
        async getChat(uuid) {
            const { $fetch } = useNuxtApp();
            const { t } = useI18n();

            try {
                const response = await $fetch(`/api/chat/getChat?uuid=${uuid}`);

                this.chat = response.results.results;
            } catch (error) {
                console.error(error);
                message.error(t("client.store.chat.error2") + error);
            }
        },
        async send(content, t) {
            const route = useRoute();
            const { $fetch } = useNuxtApp();

            // 输入验证
            if (!content) {
                return message.error(t("client.store.chat.noInput"));
            }
            if (this.isAwaitAnswer) {
                return message.warning(t("client.store.chat.isAwait"));
            }

            this.isAwaitAnswer = true;
            this.isAwaitAnswerStart = true;

            try {
                // 获取用户信息
                const token = localStorage.getItem("token");
                const { id: uid } = analysisToken(token);
                const { type, model } = JSON.parse(localStorage.getItem("model"));
                let { isRea } = JSON.parse(localStorage.getItem("model"));
                if (isRea === "true") {
                    isRea = true;
                } else {
                    isRea = false;
                }
                const uuid = route.params.uuid;

                // 发送用户消息并准备接收AI消息
                this.chat.push({ id: null, uid, model, role: "user", content });
                if (isRea) {
                    this.chat.push({ id: null, uid, model, role: "reasoning", content: "" });
                }
                this.chat.push({ id: null, uid, model, role: "assistant", content: "" });

                // 发送请求到后端
                const response = await this.sendChatRequest({ uuid, uid, type, model, content, token, isRea });

                this.isAwaitAnswerStart = false;
                // 处理流式数据并更新聊天记录
                await this.handleChatStream(response);

                // 获取最新的聊天记录
                await this.updateChatHistory(uuid, $fetch, t);
            } catch (error) {
                console.error(error);
                message.error(t("client.store.chat.error3") + error);
                this.chat[this.chat.length - 1].content = t("client.store.chat.error3") + error;
                await this.updateChatHistory(uuid, $fetch, t);
            } finally {
                this.isAwaitAnswer = false;
                this.isNewChat = false;
            }
        },
        // 发送聊天请求
        async sendChatRequest({ uuid, uid, type, model, content, token, isRea }) {
            const controller = new AbortController();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 60000));

            try {
                const response = await Promise.race([
                    fetch("/api/chat/chat", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ uuid, uid, type, model, content, isRea }),
                        signal: controller.signal,
                    }),
                    timeoutPromise,
                ]);
                return response;
            } catch (error) {
                controller.abort();
                throw error;
            }
        },
        // 处理聊天流
        async handleChatStream(response) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = ""; // 缓存接收到的数据
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                // 解码数据并追加到缓冲区
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                }

                // 处理缓冲区中的数据
                let index;
                while (
                    (index = buffer.indexOf("[CONTENT]")) >= 0 ||
                    (index = buffer.indexOf("[REASONING]")) >= 0 ||
                    (index = buffer.indexOf("[DONE]")) >= 0
                ) {
                    // 找到第一个标记的位置
                    let marker;
                    if (buffer.startsWith("[CONTENT]")) {
                        marker = "[CONTENT]";
                    } else if (buffer.startsWith("[REASONING]")) {
                        marker = "[REASONING]";
                    } else if (buffer.startsWith("[DONE]")) {
                        marker = "[DONE]";
                    }

                    // 提取标记之前的数据（如果有）
                    if (index > 0) {
                        const extraData = buffer.slice(0, index);
                        console.warn("未标记的数据:", extraData);
                    }

                    // 提取标记之后的数据
                    buffer = buffer.slice(index + marker.length);

                    // 如果是 [DONE] 标记，直接结束
                    if (marker === "[DONE]") {
                        break;
                    }

                    // 找到下一个标记的位置
                    const nextIndex = Math.min(
                        buffer.indexOf("[CONTENT]") >= 0 ? buffer.indexOf("[CONTENT]") : Infinity,
                        buffer.indexOf("[REASONING]") >= 0 ? buffer.indexOf("[REASONING]") : Infinity,
                        buffer.indexOf("[DONE]") >= 0 ? buffer.indexOf("[DONE]") : Infinity
                    );

                    // 提取当前标记对应的数据
                    const data = nextIndex >= 0 ? buffer.slice(0, nextIndex) : buffer;
                    buffer = nextIndex >= 0 ? buffer.slice(nextIndex) : "";

                    // 根据标记处理数据
                    if (marker === "[CONTENT]") {
                        const content = data.trim();
                        this.chat[this.chat.length - 1].content += content;
                    } else if (marker === "[REASONING]") {
                        const reasoningContent = data.trim();
                        this.chat[this.chat.length - 2].content += reasoningContent;
                    }
                }
            }

            // 处理缓冲区中剩余的数据
            if (buffer.length > 0) {
                console.warn("未标记的剩余数据:", buffer);
            }
        },
        // 更新聊天记录
        async updateChatHistory(uuid, $fetch, t) {
            try {
                const response = await $fetch(`/api/chat/getChat?uuid=${uuid}`);
                this.chat = response.results.results;
            } catch (error) {
                console.error(error);
                message.error(t("client.store.chat.error2") + error);
            }
        },

        async listAddItem(uuid, content, t) {
            let todayChat = this.chatList.find((item) => item.date === t("client.sider.time.today"));

            if (todayChat) {
                this.chatList[0].items.unshift({
                    uuid: uuid,
                    data: t("client.sider.time.today"),
                    content: content,
                });
            } else {
                this.chatList.unshift({
                    date: t("client.sider.time.today"),
                    items: [
                        {
                            uuid: uuid,
                            data: t("client.sider.time.today"),
                            content: content,
                        },
                    ],
                });
            }
        },
        async regenerate(id, t) {
            const route = useRoute();
            const { $fetch } = useNuxtApp();

            if (this.isAwaitAnswer) {
                return message.warning(t("client.store.chat.isAwait"));
            }

            this.isAwaitAnswer = true;

            try {
                const uid = analysisToken(localStorage.getItem("token")).id;
                const { type, model } = JSON.parse(localStorage.getItem("model"));
                const uuid = route.params.uuid;

                const index = this.chat.findIndex((item) => item.id === id);
                this.chat[index].content = "";
                this.chat.splice(index + 1);

                const token = localStorage.getItem("token");
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000);
                const response = await fetch(`/api/chat/regenerate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        uuid: uuid,
                        uid: uid,
                        type: type,
                        model: model,
                        content: this.chat,
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
                    this.chat[this.chat.length - 1].content += chunkText;

                    if (chunkText.includes("[DONE]")) {
                        await this.updateChatHistory(uuid, $fetch, t);
                    }
                }
            } catch (error) {
                console.error(error);
                message.error(t("client.store.chat.error3") + error);
            } finally {
                this.isAwaitAnswer = false;
            }
        },
    },
});
