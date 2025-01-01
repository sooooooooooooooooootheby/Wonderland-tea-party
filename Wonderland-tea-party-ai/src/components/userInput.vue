<template>
    <div class="inputBox">
        <d-textarea
            v-model="input"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="交给我吧! 😎"
            :show-glow-style="false"
            @keydown="handleKeyDown"
        ></d-textarea>
        <div class="bar">
            <div class="left"></div>
            <div class="right">
                <div class="icons" @click="sendMessage">
                    <Icon class="icon" icon="mynaui:send-solid" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { chatStore } from "@/stores/chatStores.js";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import tool from "@/utils/tool";

const chat = chatStore();
const router = useRouter();
const input = ref("");
const props = defineProps(["uuid"]);
const isBottom = ref("");

const getPath = (path) => {
    return path.split("/")[1];
};

const sendMessage = async () => {
    const path = getPath(router.currentRoute.value.path);

    if (input.value === "") {
        return ElMessage.error("你还没有输入!😡");
    }

    // 不是新聊天
    if (path === "chat") {
        chat.uuid = props.uuid;
        chat.sendMessage(input.value);
        input.value = "";
        return;
    }

    // 是新聊天
    chat.uuid = uuidv4();
    chat.isNew = true;
    const timestamp = new Date().toISOString();
    const newMessage = [{ uuid: chat.uuid, data: timestamp, message: input.value }];
    chat.messagesList.unshift(tool.handleData(newMessage)[0]);
    await router.push(`/chat/${chat.uuid}`);
    chat.sendMessage(input.value);
    input.value = "";
};

const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
        sendMessage();
    }
};
</script>

<style lang="scss" scoped>
.inputBox {
    min-width: 800px;
    padding: 16px 10px;
    background-color: #303030;
    border-radius: 24px;
    border: 1px solid rgba(5, 5, 5, 0.4);
    display: flex;
    flex-direction: column;

    * {
        color: #ffffff;
    }

    .bar {
        padding: 4px 11px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .right {
            display: flex;
        }
    }
}
</style>
