import { defineStore } from "pinia";
import Axios from "@/utils/axios.js";
import { ElMessage } from "element-plus";
import tool from "@/utils/tool";

export const chatStore = defineStore("chat", {
    state: () => ({
        messagesList: [],
        messages: [],
        uuid: null,
        isAwaitSendMessage: false,
        isAwaitGetMessage: false,
        isNew: false,
    }),
    actions: {
        // 获取消息列表
        async getMessagesList() {
            try {
                const res = await Axios.get("/chat/queryMessagesList");
                this.messagesList = tool.handleData(res.list);
            } catch (error) {
                console.log(error);
                ElMessage.error("获取聊天列表出错!🫠");
            }
        },
        // 发送消息
        async sendMessage(input) {
            if (input === "") {
                return ElMessage.error("你还没有输入!😡");
            }
            if (this.isAwaitSendMessage) {
                return ElMessage.error("慢一点, 受不了了 🥵");
            }

            this.isAwaitSendMessage = true;
            this.messages.push({
                role: "user",
                message: input,
            });

            try {
                const res = await Axios.post("/chat/multiwheelChat", {
                    uuid: this.uuid,
                    message: input,
                });
                this.messages.push({
                    role: "assistant",
                    message: res.message,
                });
                this.isAwaitSendMessage = false;
            } catch (error) {
                console.log(error);
                ElMessage.error("发送消息出错!🫠");
            }
        },
        // 获取消息
        async getMessage(uuid) {
            if (!uuid) {
                ElMessage.error("uuid呢?🧐");
            }

            if (this.isAwaitGetMessage) {
                return;
            }
            this.isAwaitGetMessage = true;

            try {
                const res = await Axios.get("/chat/queryMessageRecord", {
                    params: {
                        uuid,
                    },
                });
                this.messages = res.messages;
                this.isAwaitGetMessage = false;
            } catch (error) {
                this.isAwaitGetMessage = false;
                console.log(error);
                ElMessage.error("获取聊天记录出错!🫠");
                return;
            }
        },
    },
});