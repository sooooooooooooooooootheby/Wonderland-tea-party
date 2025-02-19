import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { v4 as uuidv4 } from "uuid";

const handleDate = (type = "date", date = Date.now(), t) => {
    let res = null;

    if (Math.floor(date / 10000000000) === 0) {
        date *= 1000;
    }

    switch (type) {
        case "date":
            const time = new Date(date);
            const Y = time.getFullYear();
            const M = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
            const D = String(time.getDate()).padStart(2, "0");
            const h = String(time.getHours()).padStart(2, "0");
            const m = String(time.getMinutes()).padStart(2, "0");
            const s = String(time.getSeconds()).padStart(2, "0");

            res = `${Y}-${M}-${D} ${h}:${m}:${s}`;
            break;
        case "text":
            const now = new Date();
            const inputDate = new Date(date);
            const diffTime = now - inputDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                res = t("client.sider.time.today");
            } else if (diffDays === 1) {
                res = t("client.sider.time.yesterday");
            } else if (diffDays === -1) {
                res = t("client.sider.time.tomorrow");
            } else {
                res = ` ${Math.abs(diffDays)}${t("client.sider.time.day")}${
                    diffDays > 0 ? t("client.sider.time.ago") : t("client.sider.time.later")
                }`;
            }
            break;
        default:
            console.error(`ERROR: The type = "${type}" parameter is incorrect`);
            break;
    }

    return res;
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
                    list[i].data = handleDate("text", response.results[i].data, t);
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
        /*
         * 这是答辩, 用 ai 优化了一下, 我留着是怕删了原来的代码, 看不懂 ai 写的了
         */
        // async send(content, t) {
        //     const route = useRoute();
        //     const router = useRouter();
        //     const { $fetch } = useNuxtApp();

        //     if (!content) {
        //         return message.error(t("client.store.chat.noInput"));
        //     }
        //     if (this.isAwaitAnswer) {
        //         return message.warning(t("client.store.chat.isAwait"));
        //     }

        //     this.isAwaitAnswer = true;

        //     try {
        //         const uid = analysisToken(localStorage.getItem("token")).id;
        //         const { type, model } = JSON.parse(localStorage.getItem("model"));

        //         let uuid = route.params.uuid;
        //         let isNew = false;
        //         if (!uuid) {
        //             this.isNewChat = true;
        //             uuid = uuidv4();
        //             router.push(`/chat/${uuid}`);
        //             this.listAddItem(uuid, content, t);
        //             isNew = true;
        //         }

        //         this.chat.push({
        //             id: null,
        //             uid: uid,
        //             model: model,
        //             role: "user",
        //             content: content,
        //         });
        //         this.chat.push({
        //             id: null,
        //             uid: uid,
        //             model: model,
        //             role: "assistant",
        //             content: "",
        //         });

        //         const token = localStorage.getItem("token");
        //         const controller = new AbortController();
        //         const timeoutId = setTimeout(() => controller.abort(), 60000);
        //         const response = await fetch(`/api/chat/chat`, {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify({
        //                 uuid: uuid,
        //                 uid: uid,
        //                 type: type,
        //                 model: model,
        //                 content: content,
        //                 isNew: isNew,
        //             }),
        //             signal: controller.signal,
        //         });

        //         clearTimeout(timeoutId);

        //         const reader = response.body.getReader();
        //         const decoder = new TextDecoder();
        //         let done = false;

        //         while (!done) {
        //             const { value, done: doneReading } = await reader.read();
        //             done = doneReading;
        //             let chunkText = decoder.decode(value, { stream: true });
        //             this.chat[this.chat.length - 1].content += chunkText;
        //         }

        //         try {
        //             const response = await $fetch(`/api/chat/getChat?uuid=${uuid}`);

        //             this.chat = response.results.results;
        //         } catch (error) {
        //             console.error(error);
        //             message.error(t("client.store.chat.error2") + error);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         message.error(t("client.store.chat.error3") + error);
        //     } finally {
        //         this.isAwaitAnswer = false;
        //     }
        // },
        async send(content, t) {
            const route = useRoute();
            const router = useRouter();
            const { $fetch } = useNuxtApp();

            // 输入验证
            if (!content) {
                return message.error(t("client.store.chat.noInput"));
            }
            if (this.isAwaitAnswer) {
                return message.warning(t("client.store.chat.isAwait"));
            }

            this.isAwaitAnswer = true;

            try {
                // 获取用户信息
                const token = localStorage.getItem("token");
                const { id: uid } = analysisToken(token);
                const { type, model } = JSON.parse(localStorage.getItem("model"));

                let uuid = route.params.uuid;
                let isNew = false;

                // 如果没有uuid，表示是新聊天
                if (!uuid) {
                    this.isNewChat = true;
                    uuid = uuidv4();
                    router.push(`/chat/${uuid}`);
                    this.listAddItem(uuid, content, t);
                    isNew = true;
                }

                // 发送用户消息并准备接收AI消息
                this.chat.push({ id: null, uid, model, role: "user", content });
                this.chat.push({ id: null, uid, model, role: "assistant", content: "" });

                // 发送请求到后端
                const response = await this.sendChatRequest({ uuid, uid, type, model, content, isNew, token });

                // 处理流式数据并更新聊天记录
                await this.handleChatStream(response);

                // 获取最新的聊天记录
                await this.updateChatHistory(uuid, $fetch, t);
            } catch (error) {
                console.error(error);
                message.error(t("client.store.chat.error3") + error);
            } finally {
                this.isAwaitAnswer = false;
            }
        },
        // 发送聊天请求
        async sendChatRequest({ uuid, uid, type, model, content, isNew, token }) {
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
                        body: JSON.stringify({ uuid, uid, type, model, content, isNew }),
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
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkText = decoder.decode(value, { stream: true });
                this.chat[this.chat.length - 1].content += chunkText;
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
