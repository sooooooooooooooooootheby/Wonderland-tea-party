<template>
    <div class="room">
        <v-virtual-scroll :items="chat.chat" class="messageBox" v-if="chat.chat && chat.chat.length > 0">
            <template v-slot:default="{ item, index }">
                <div class="box">
                    <div class="avatar" v-if="item.role === 'user'">
                        <img src="/logo_small.webp" alt="" />
                    </div>
                    <div class="bar" v-if="item.role === 'reasoning'">
                        <div class="badge badge-accent badge-outline">{{ item.model }}</div>
                    </div>
                    <div
                        class="loading assistant"
                        v-if="
                            chat.isAwaitAnswerStart &&
                            (item.role === 'assistant' || item.role == 'reasoning') &&
                            index + 1 === chat.chat.length
                        "
                    ></div>
                    <div
                        class="prose"
                        :class="{
                            user: item.role === 'user',
                            reasoning: item.role === 'reasoning',
                            assistant: item.role === 'assistant',
                        }"
                        v-html="md.render(item.content)"
                        v-else
                    ></div>
                    <div
                        class="tool"
                        v-if="item.role === 'assistant'"
                        :class="{ isShow: chat.isAwaitAnswer && index === chat.chat.length - 1 }"
                    >
                        <div class="button square btn" @click="copy(item.content)">
                            <Icon class="icon" name="mynaui:copy" />
                        </div>
                        <div class="button rectangle btn" @click="chat.regenerate(item.id, t)">
                            <Icon class="icon" name="mynaui:refresh" />
                            <span>{{ $t("client.chat.chat.regenerate") }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </v-virtual-scroll>
        <div class="skeletonBox flex w-52 flex-col gap-4" v-else>
            <div class="skeleton h-4 w-32"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-1/2"></div>
            <div class="skeleton h-4 w-1/3"></div>
            <div class="skeleton h-4 w-4/5"></div>
        </div>
    </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import MarkdownIt from "markdown-it";
import prism from "markdown-it-prism";
import "prismjs/components/prism-c.min.js";
import "prismjs/components/prism-sql.min.js";
import "prismjs/components/prism-python.min.js";
import "prismjs/components/prism-java.min.js";
import "prismjs/components/prism-markdown.min.js";
import "prismjs/components/prism-bash.min.js";

const route = useRoute();
const { $fetch } = useNuxtApp();
const md = new MarkdownIt().use(prism);
const chat = useChatStore();
const { t } = useI18n();

const copy = (content) => {
    navigator.clipboard.writeText(content);
    message.success(t("client.chat.chat.copy"));
};

onMounted(async () => {
    if (!chat.isNewChat) {
        await chat.getChat(route.params.uuid);
    }
});
</script>

<style lang="scss" scoped>
[data-theme="dark"] .room {
    .messageBox {
        .box {
            .tool {
                .button {
                    border: 1px solid #2b3039;
                }
                .button:hover {
                    background-color: #2b3039;
                }
            }
        }
        .box:has(.assistant) {
            border-bottom: 1px solid #2b3039;
        }
    }
}
[data-theme="dark"] .room::after {
    background-color: #1d232a;
    box-shadow: 0 0 20px 25px #1d232a;
}
.room {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;

    .skeletonBox {
        width: calc(100% - 30vw);
        height: 100%;
        margin: 0 auto;
        padding: 64px 0;
    }

    .messageBox {
        height: 100vh;
        padding: 64px 0;
        padding-bottom: 80px;

        .box {
            width: calc(100% - 30vw);
            margin: 0 auto;
            padding-left: 52px;
            display: flex;
            flex-direction: column;

            .avatar {
                width: 32px;
                height: 32px;
                margin: 0 12px;
                flex-shrink: 0;

                img {
                    border-radius: 999px;
                }
            }
            .bar {
                margin: 12px 0 8px 0;
            }
            .reasoning {
                padding-left: 12px;
                opacity: 0.7;
                border-left: 2px solid;
            }
            .prose,
            .bar,
            .tool {
                max-width: 100%;
                width: 100%;
                align-self: flex-end;

                .button {
                    height: 32px;
                    min-height: 32px;
                    margin-right: 12px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    transition: 0.2s;
                    cursor: pointer;
                }
                .button:hover {
                    background-color: #e5e7eb;
                }
                .square {
                    width: 32px;
                }
                .rectangle {
                    width: auto;
                    padding: 0 10px;
                    font-size: 0.9rem;
                }

                h1 {
                    margin: 24px 12px;
                }
            }
            .loading {
                padding-left: 0 !important;
            }
            .assistant {
                margin-bottom: 24px;
            }
            .tool {
                margin-bottom: 24px;
                display: flex;
            }
            .isShow {
                display: none;
            }
        }
        .box:has(.assistant) {
            border-bottom: 1px solid #e5e7eb;
        }
        .box:has(.user) {
            padding-top: 32px;
        }
        .box:has(.avatar) {
            flex-direction: row;
            padding-left: 0;
        }
    }
    .down {
        position: absolute;
        bottom: 100px;
        left: 50%;

        .icon {
            font-size: 1rem;
        }
    }
}
.room::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background: rgb(255, 255, 255);
    pointer-events: none;
    box-shadow: 0 0 20px 25px #ffffff;
}

@media (max-width: 900px) {
    .room {
        .messageBox {
            padding-top: 82px;
            .box {
                width: calc(100% - 24px);
            }
        }
    }
}
</style>
