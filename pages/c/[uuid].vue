<template>
    <div class="chat">
        <div class="chatMain">
            <div class="box">
                <!-- <VirtList :list="chat.chat.slice(1)" itemKey="id" :minSize="40">
                    <template #default="{ itemData, index }">
                        <div class="scroll">
                            <div class="message" :class="{ user: itemData.role === 'user' }">
                                <p v-html="renderMarkdown(itemData.content)"></p>
                                <div class="bar" v-if="itemData.role === 'assistant'">
                                    <a-tag>{{ itemData.id }}</a-tag>
                                    <a-tag :color="judgeModel(itemData.model)">{{ itemData.model }}</a-tag>
                                </div>
                                <div v-if="chat.isAwaitAnswer && index === chat.chat.length - 2" class="loading">
                                    {{ randomNeko() }}
                                </div>
                            </div>
                        </div>
                    </template>
                </VirtList> -->
                <div class="scroll">
                    <div class="item" v-for="(item, index) in chat.chat.slice(1)" :key="item.id">
                        <div class="message" :class="{ user: item.role === 'user' }">
                            <p v-html="renderMarkdown(item.content)"></p>
                            <div v-if="chat.isAwaitAnswer && index === chat.chat.length - 2" class="loading">
                                {{ randomNeko() }}
                            </div>
                            <div class="bar" v-if="item.role === 'assistant'">
                                <a-tag v-if="item.id">{{ item.id }}</a-tag>
                                <a-tag :color="judgeModel(item.model)">{{ item.model }}</a-tag>
                            </div>
                        </div>
                    </div>
                    <div class="lastElement" ref="lastElement" v-if="isItemsRendered"></div>
                </div>
            </div>
            <div class="inputBar">
                <div class="down" v-if="isDown" @click="scrollToLastElement">
                    <Icon class="icon" name="mynaui:arrow-down-circle-solid" />
                </div>
                <div class="inputBox">
                    <inputs />
                </div>
            </div>
        </div>
        <edit />
    </div>
</template>

<script setup>
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { LoadingOutlined } from "@ant-design/icons-vue";

const route = useRoute();
const chat = useChatStore();

const neko = ref(["😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿"]);

const randomNeko = () => {
    return neko.value[Math.floor(Math.random() * neko.value.length)];
};

const judgeModel = (model) => {
    let color;
    switch (model) {
        case "gpt-4o":
            color = "pink";
            break;
        case "qwen-plus":
            color = "purple";
        default:
            color = "green";
            break;
    }
    return color;
};

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: "18px",
    },
    spin: true,
});

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
marked.setOptions({
    breaks: true,
});
const renderMarkdown = (text) => {
    return marked.parse(text);
};

const lastElement = ref(null);
const isVisible = ref(false);
const isItemsRendered = ref(false);
const isDown = ref(true);
const isFirstScroll = ref(false);

const scrollToLastElement = () => {
    nextTick(() => {
        const lastElements = lastElement.value;
        if (lastElements) {
            lastElements.scrollIntoView({ behavior: "smooth", block: "end" }); // 平滑滚动
        }
    });
};

const observeLastElement = () => {
    if (!lastElement.value) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    isVisible.value = true;
                    isDown.value = false;
                } else {
                    isDown.value = true;
                }
            });
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        }
    );

    observer.observe(lastElement.value);
};

onMounted(() => {
    if (!chat.isNewChat) {
        chat.getChat(route.params.uuid);
    }
    isFirstScroll.value = false;
});
onUpdated(() => {
    nextTick(() => {
        isItemsRendered.value = true;
        observeLastElement();
        if (!isFirstScroll.value) {
            scrollToLastElement();
            isFirstScroll.value = true;
        }
    });
});
watch(
    () => chat.isAwaitAnswer,
    (newVal) => {
        if (newVal) {
            const interval = setInterval(() => {
                scrollToLastElement();
                if (!chat.isAwaitAnswer) {
                    clearInterval(interval);
                }
                window.addEventListener("wheel", () => {
                    clearInterval(interval);
                });
            }, 1000);
        }
    }
);
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

        .box {
            width: 100%;
            height: calc(100vh - 58px - 20px);
            overflow: scroll;
            overflow-x: hidden;
        }

        .inputBar {
            width: 800px;
            height: 78px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            border-top: 1px solid rgba(93, 93, 93, 0.2);
            position: relative;

            .down {
                position: absolute;
                top: -38px;
                right: 0;

                .icon {
                    font-size: 2rem;
                    color: #5d5d5d;
                    transition: 0.2s;
                    cursor: pointer;
                }
            }
            .down:hover {
                .icon {
                    color: #000000;
                }
            }
            .inputBox {
                width: 700px;
                height: 52px;
                margin-top: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.scroll {
    width: 700px;
    margin: 0 auto;
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .item {
        display: flex;
        flex-direction: column;

        .message {
            max-width: 600px;
            margin: 12px 0;
            font-size: 16px;

            p {
                margin-bottom: 0;
            }
        }

        .user {
            align-self: flex-end;
            padding: 6px 12px;
            background-color: #f4f4f4;
            border-radius: 12px;

            p {
                margin: 0;
            }
        }

        .bar {
            margin-top: 12px;
        }
    }
    .lastElement {
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
    }
}
</style>
