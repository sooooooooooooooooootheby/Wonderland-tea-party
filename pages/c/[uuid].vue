<template>
    <div class="chat">
        <div class="chatMain">
            <div class="box">
                <div class="scroll">
                    <div class="message" :class="{ user: item.role === 'user' }"
                         v-for="(item, index) in chat.chat.slice(1)"
                         :key="index">
                        <p v-html="renderMarkdown(item.content)"></p>
                    </div>
                </div>
            </div>
            <div class="inputBar">
                <inputs/>
            </div>
        </div>
       <edit/>
    </div>
</template>

<script setup>
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";
import {LoadingOutlined} from '@ant-design/icons-vue';

const route = useRoute();
const chat = useChatStore();

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '18px',
    },
    spin: true,
});

const marked = new Marked(
    markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, {language}).value;
        },
    })
);
marked.setOptions({
    breaks: true,
});
const renderMarkdown = (text) => {
    return marked.parse(text);
};

onMounted(() => {
    if (!chat.isNewChat) {
        chat.getChat(route.params.uuid);
    }
});
</script>

<style lang="scss" scoped>
@import url("~/assets/sspai.css");

.chat {
    width: 100%;
    height: 100vh;
    display: flex;

    .chatMain {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .box {
            width: 100%;
            height: calc(100vh - 58px - 12px);
            overflow: scroll;
            overflow-x: hidden;
            padding: 32px 0;

            .scroll {
                width: 700px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;

                .message {
                    max-width: 600px;
                    margin: 4px 0;
                    font-size: 16px;
                }

                .user {
                    align-self: flex-end;
                    padding: 6px 12px;
                    background-color: #F4F4F4;
                    border-radius: 12px;

                    p {
                        margin: 0;
                    }
                }
            }
        }

        .inputBar {
            width: 900px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid rgba(93, 93, 93, 0.2);
        }
    }
}
</style>
