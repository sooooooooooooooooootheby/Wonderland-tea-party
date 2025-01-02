<template>
    <div class="chatView">
        <div class="chat">
            <div v-for="(item, index) in chat.messages" :key="index" class="message" :class="{ user: item.role === 'user' }">
                <!-- <div class="message-text" v-html="renderMarkdown(item.message)"></div> -->
                <div class="message-text" v-html="renderMarkdown(item.message)"></div>
            </div>
            <div class="loadingBox" v-if="chat.isAwait">
                <div class="loading"></div>
            </div>
            <div class="bottom" ref="bottom"></div>
        </div>
        <div class="input">
            <userInput :uuid="route.params.uuid" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { chatStore } from "@/stores/chatStores.js";
import { useRoute, useRouter } from "vue-router";
import userInput from "@/components/userInput.vue";
import tool from "@/utils/tool";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const chat = chatStore();
const router = useRouter();
const route = useRoute();

const marked = new Marked(
    markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        },
    })
);

const renderMarkdown = (text) => {
    return marked.parse(text);
};

const bottom = ref(null);

watch(
    () => chat.messages,
    () => {
        nextTick(() => {
            tool.scrollToBottom(bottom.value);
        });
    },
    { deep: true }
);

onMounted(async () => {
    if (!chat.isNew) {
        await chat.getMessage(route.params.uuid, bottom.value);
        tool.scrollToBottom(bottom.value);
    }
});
</script>

<style lang="scss" scoped>
.chatView {
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .chat {
        width: 800px;
        padding-top: 32px;
        display: flex;
        flex-direction: column;

        .message {
            margin-bottom: 32px;
            padding: 4px 18px;
            border-radius: 12px;
            background-color: #303030;
            align-self: flex-start;

            .message-text {
                * {
                    margin: 0;
                    margin: 8px 0;
                    line-height: 24px;
                }
            }
        }
        .user {
            background-color: #303548;
            align-self: flex-end;
        }
        .loadingBox {
            display: flex;
            flex-direction: column;

            .loading {
                width: 500px;
                height: 48px;
                margin: 4px 0;
                border-radius: 12px;
                background-color: #303030;
                background: linear-gradient(90deg, #303030 0%, #555555 50%, #303030 100%);
                background-size: 200% 100%;
                animation: loadingAnimation 8s infinite ease-in-out;
            }
            @keyframes loadingAnimation {
                0% {
                    background-position: 200% 0;
                }
                50% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }
        }
    }
    .bottom {
        width: 100%;
        height: 156px;
    }
    .input {
        width: 800px;
        position: fixed;
        bottom: 32px;
    }
}
</style>
