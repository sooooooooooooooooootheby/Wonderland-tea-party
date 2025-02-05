<template>
    <div class="input">
        <div class="inputMain">
            <a-dropdown placement="topLeft" :trigger="['click']" v-if="model.selectedModel.type">
                <a class="ant-dropdown-link" @click.prevent>
                    <div class="selectModel">
                        <img :src="`/${model.selectedModel.type}.png`" alt="model" />
                    </div>
                </a>
                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            v-for="item in model.modelList"
                            :key="item.id"
                            @click="model.selectedModel = item"
                            :disabled="item.status !== 'active'"
                        >
                            <div class="menuItem">
                                <div class="avatar">
                                    <img :src="`/${item.type}.png`" />
                                </div>
                                <div class="info">
                                    <p class="name">{{ item.name }}</p>
                                    <p class="introduction">{{ item.introduction }}</p>
                                </div>
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-input v-model:value="edit.input" :bordered="false" placeholder="交给我吧😼" @keyup.enter="handleSend" />
        </div>
        <div class="button" :class="{ isShowSend: isShowSend }" @click="handleSend">
            <Icon class="icon" name="mynaui:send-solid" />
        </div>
        <div class="button" @click="edit.isOpen = !edit.isOpen">
            <Icon class="icon" name="mynaui:pen-solid" />
        </div>
    </div>
</template>

<script setup>
import { message } from "ant-design-vue";

const model = useModelStore();
const chat = useChatStore();
const edit = useEditStore();
const route = useRoute();

const uuid = route.params.uuid;
const isShowSend = ref(true);

const handleSend = () => {
    if (!edit.input) {
        return message.error("你还没有输入!😿");
    }
    if (uuid) {
        chat.sendMessage(uuid, edit.input);
        return (edit.input = "");
    }
    chat.createNewChat(edit.input);
    edit.input = "";
};

onMounted(() => {
    model.getModelList();
});

watch(
    () => edit.input,
    (newValue) => {
        if (newValue === "") {
            isShowSend.value = true;
        } else {
            isShowSend.value = false;
        }
    }
);
</script>

<style lang="scss" scoped>
.input {
    height: 52px;
    display: flex;
    align-items: center;

    .inputMain {
        width: 600px;
        height: 100%;
        padding: 0 12px;
        display: flex;
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 12px;

        .selectModel {
            width: 32px;
            height: 32px;
            border-radius: 999px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                scale: 1.1;
            }
        }
    }

    .button {
        width: 48px;
        height: 48px;
        margin-left: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 999px;
        transition: 0.2s;
        cursor: pointer;

        .icon {
            font-size: 1.4rem;
            margin-top: 3px;
        }
    }

    .button:hover {
        background-color: #5d5d5d;

        .icon {
            color: #f4f4f4;
        }
    }

    .isShowSend {
        scale: 0;
        width: 0;
    }
}

.menuItem {
    display: flex;
    align-items: center;

    .avatar {
        width: 32px;
        height: 32px;
        margin-right: 12px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .info {
        .name {
            font-weight: bold;
        }

        .introduction {
            opacity: 0.8;
        }
    }
}
</style>
