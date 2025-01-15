<template>
    <div class="sider">
        <div class="bar">
            <div class="icons" @click="emit('updateSiderWidth', '0px')">
                <Icon class="icon" name="mynaui:panel-right-open-solid"/>
            </div>
<!--            <div class="icons">-->
<!--                <Icon class="icon" name="mynaui:menu-solid"/>-->
<!--            </div>-->
            <div class="icons" @click="navigateTo(handleSkip(`/c`))">
                <Icon class="icon" name="mynaui:edit-one-solid"/>
            </div>
            <div class="icons" @click="dev = true">
                <Icon class="icon" name="mynaui:tool-solid"/>
            </div>
        </div>
        <ul class="menu">
            <li class="item" v-for="(messagesForDate, date) in chat.chatList" :key="messagesForDate"
                v-if="!chat.isAwaitChatList">
                <p class="date">{{ date }}</p>
                <ul class="chatList">
                    <li class="listItem" :class="{isActive: item.uuid === route.params.uuid}"
                        v-for="item in messagesForDate" :key="item.uuid"
                        @click="handleSkip(`/c/${item.uuid}`)">
                        {{ item.content }}
                    </li>
                </ul>
            </li>
            <div class="load" v-else>
                <a-spin class="spin" :indicator="indicator"/>
            </div>
        </ul>
        <a-drawer
            v-model:open="dev"
            class="custom-class"
            root-class-name="root-class-name"
            title="开发工具"
            placement="right"
        >
            <h2>chat store</h2>
            <p>isAwaitChatList: {{ chat.isAwaitChatList }}</p>
            <p>isAwaitChat: {{ chat.isAwaitChat }}</p>
            <p>isAwaitAnswer: {{ chat.isAwaitAnswer }}</p>
            <p>isNewChat: {{ chat.isNewChat }}</p>
            <br>
            <p>chatList: {{ chat.chatList }}</p>
            <br>
            <p>chat: {{ chat.chat }}</p>
            <br>
            <br>
            <h2>model store</h2>
            <p>modelList: {{ model.modelList }}</p>
            <br>
            <p>selectedModel: {{ model.selectedModel }}</p>
        </a-drawer>
    </div>
</template>

<script setup>
import {LoadingOutlined} from '@ant-design/icons-vue';

const chat = useChatStore();
const model = useModelStore();
const emit = defineEmits();
const route = useRoute();

const dev = ref(false);

const handleSkip = (path) => {
    if (path === route.path) {
        return;
    }
    chat.chat = [{
        role: "system",
        content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
    }];
    navigateTo(path);
}

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '18px',
    },
    spin: true,
});

onMounted(() => {
    chat.getChatList();
})
</script>

<style lang='scss' scoped>
.sider {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    white-space: nowrap;

    .bar {
        padding: 10px;
        display: flex;

        .icons {
            margin-right: 4px;
        }
    }

    .menu {
        height: calc(100% - 60px);
        padding: 10px;
        overflow: scroll;
        overflow-x: hidden;

        .item {
            margin: 12px 0;

            .date {
                margin-bottom: 4px;
                margin-left: 8px;
                font-weight: bold;
            }

            .chatList {
                .listItem {
                    margin: 2px 0;
                    padding: 6px 8px;
                    border-radius: 8px;
                    transition: .2s;
                    cursor: pointer;
                }

                .listItem:hover {
                    background-color: rgba(224, 224, 224, 0.5);
                }

                .isActive {
                    background-color: #E0E0E0 !important;
                }
            }
        }

        .load {
            width: 100%;
            padding-right: 12px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>