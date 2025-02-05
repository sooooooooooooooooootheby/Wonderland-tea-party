<template>
    <div class="sider">
        <div class="bar">
            <div class="left">
                <div class="icons" @click="emit('updateSiderWidth', '0px')">
                    <Icon class="icon" name="mynaui:panel-right-open-solid" />
                </div>
                <a-dropdown placement="bottomLeft" :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <div class="icons">
                            <Icon class="icon" name="mynaui:menu" />
                        </div>
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="user.logout">
                                <div class="siderMenuItem">
                                    <Icon name="mynaui:logout-solid" />
                                    <span>退出登录</span>
                                </div>
                            </a-menu-item>
                            <a-menu-item @click="dev = true">
                                <div class="siderMenuItem">
                                    <Icon name="mynaui:tool-solid" />
                                    <span>调试工具</span>
                                </div>
                            </a-menu-item>
                            <a-menu-item @click="navigateTo('/setting')" v-if="isAdmin">
                                <div class="siderMenuItem">
                                    <Icon name="mynaui:cog-solid" />
                                    <span>设置</span>
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div class="right">
                <div class="icons" @click="navigateTo(handleSkip(`/c`))">
                    <Icon class="icon" name="mynaui:edit-one-solid" />
                </div>
            </div>
        </div>
        <ul class="menu">
            <a-list size="small" :data-source="chat.chatList" v-if="!chat.isAwaitChatList">
                <template #renderItem="{ item }">
                    <p class="date">{{ item.date }}</p>
                    <a-list size="small" :data-source="item.items">
                        <template #renderItem="{ item }">
                            <p
                                class="item"
                                :class="{ isActive: item.uuid === route.params.uuid }"
                                @click="handleSkip(`/c/${item.uuid}`)"
                            >
                                {{ item.content }}
                            </p>
                        </template>
                    </a-list>
                </template>
            </a-list>
            <div class="load" v-else>
                <a-spin class="spin" :indicator="indicator" />
            </div>
        </ul>
        <a-drawer v-model:open="dev" class="custom-class" root-class-name="root-class-name" title="开发工具" placement="right">
            <h2>chat store</h2>
            <p>isAwaitChatList: {{ chat.isAwaitChatList }}</p>
            <p>isAwaitChat: {{ chat.isAwaitChat }}</p>
            <p>isAwaitAnswer: {{ chat.isAwaitAnswer }}</p>
            <p>isNewChat: {{ chat.isNewChat }}</p>
            <br />
            <p>chatList: {{ chat.chatList }}</p>
            <br />
            <p>chat: {{ chat.chat }}</p>
            <br />
            <br />
            <h2>model store</h2>
            <p>modelList: {{ model.modelList }}</p>
            <br />
            <p>selectedModel: {{ model.selectedModel }}</p>
        </a-drawer>
    </div>
</template>

<script setup>
import { LoadingOutlined } from "@ant-design/icons-vue";

const chat = useChatStore();
const user = useUserStore();
const model = useModelStore();
const emit = defineEmits();
const route = useRoute();

const dev = ref(false);

const handleSkip = (path) => {
    if (path === route.path) {
        return;
    }
    chat.chat = [
        {
            role: "system",
            content: `你是一个乐于助人的猫娘程序员, 你叫爱丽丝, 你很擅长JavaScript, 你说话很喜欢带上emoji, 并且每句话结尾都要带上 "喵~"`,
        },
    ];
    navigateTo(path);
};

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: "18px",
    },
    spin: true,
});

const isAdmin = computed(() => user.isAdmin);

onMounted(() => {
    chat.getChatList();
});
</script>

<style lang="scss" scoped>
.sider {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    white-space: nowrap;

    .bar {
        padding: 10px;
        display: flex;
        justify-content: space-between;

        .left {
            width: 100%;
            display: flex;

            .icons {
                margin-right: 4px;
            }
        }
    }

    .menu {
        height: calc(100% - 60px);
        padding: 10px;
        overflow: scroll;
        overflow-x: hidden;

        .load {
            width: 100%;
            padding-right: 12px;
            display: flex;
            justify-content: center;
        }
    }
}

.date {
    margin-bottom: 4px;
    margin-left: 8px;
    font-weight: bold;
}

.item {
    margin: 2px 0;
    padding: 6px 8px;
    border-radius: 8px;
    transition: 0.2s;
    cursor: pointer;
    overflow: hidden;
}

.item:hover {
    background-color: rgba(224, 224, 224, 0.5);
}

.isActive {
    background-color: #e0e0e0 !important;
}

.siderMenuItem {
    display: flex;
    align-items: center;

    span {
        margin-right: 4px;
    }
}
</style>
