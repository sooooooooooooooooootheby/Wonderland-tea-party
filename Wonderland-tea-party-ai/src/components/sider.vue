<template>
    <div class="sider">
        <div class="header">
            <div class="left">
                <div class="icons" @click="routerPush('/')">
                    <Icon class="icon" icon="mynaui:edit-one-solid" />
                </div>
            </div>
            <div class="right"></div>
        </div>
        <div class="body">
            <ul class="menu" v-for="(item, index) in chat.messagesList" :key="index">
                <el-affix :offset="78" class="data">
                    <p class="time">{{ item.date }}</p>
                </el-affix>
                <li
                    class="item"
                    :class="{ isActivate: items.uuid === uuid }"
                    v-for="(items, index) in item.messages"
                    :key="index"
                    @click="routerPush(`/chat/${items.uuid}`, items.uuid)"
                >
                    <p>{{ items.message }}</p>
                    <p class="uuid">{{ items.uuid }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";
import { chatStore } from "@/stores/chatStores.js";
import { useRouter } from "vue-router";

const chat = chatStore();
const router = useRouter();

const props = defineProps(["uuid"]);

const getUuid = (path) => {
    return path.split("/")[2];
};

const routerPush = (to, uuid) => {
    router.push({ path: `${to}` });

    if (!chat.isNew && to !== "/" && uuid !== props.uuid) {
        chat.getMessage(uuid);
    }
};

onMounted(async () => {
    chat.getMessagesList();
});
</script>

<style lang="scss" scoped>
.sider {
    height: 100%;
    background-color: #1a1a1c;
    border-right: 1px solid #323438;

    .header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .right {
            .ai {
                font-size: 1.2rem;
                font-weight: bold;
            }
        }
    }
    .body {
        height: calc(100% - 79px);
        overflow: scroll;

        .menu {
            padding: 12px;

            .data {
                margin-bottom: 6px;
                font-size: 16px;
                font-weight: bold;
                background-color: #1a1a1c;
                .time {
                    padding-left: 12px;
                }
                * {
                    background-color: #1a1a1c;
                }
            }
            .item {
                margin-bottom: 2px;
                padding: 8px 12px;
                padding-top: 10px;
                border-radius: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: 0.2s;
                cursor: pointer;

                .uuid {
                    opacity: 0.5;
                }
            }
            .item:hover {
                background-color: #2f2f2f;
            }
            .isActivate,
            .isActivate:hover {
                background-color: #303548;
            }
        }
    }
}
</style>
