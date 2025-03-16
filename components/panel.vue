<template>
    <div class="panel">
        <div class="model" v-if="model.model">
            <div class="dropdown dropdown-top">
                <img tabindex="0" role="button" :src="modelImage" alt="model" />
                <ul tabindex="0" class="dropdown-content bg-base-100 rounded-box z-[1] shadow">
                    <li
                        v-for="item in model.modelList"
                        :key="item.id"
                        :class="{ active: item.id === model.model.id }"
                        @click="model.selectModel(item)"
                    >
                        <div class="top">
                            <img :src="`/model/${item.icon}.webp`" alt="model" />
                            <div class="text">
                                <span class="name">{{ item.display }}</span>
                                <span class="namee">{{ item.model }}</span>
                            </div>
                        </div>
                        <p>{{ item.info }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <form @submit.prevent="send">
            <div class="inputBox">
                <input
                    type="text"
                    v-model="input"
                    :placeholder="$t('client.panel.input')"
                    class="input input-ghost w-full max-w-xs focus:outline-none"
                />
            </div>
            <div class="button" @click="send">
                <Icon class="icon" name="mynaui:arrow-up" />
            </div>
        </form>
    </div>
</template>

<script setup>
const model = useModelStore();
const chat = useChatStore();
const route = useRoute();
import { v4 as uuidv4 } from "uuid";
const { t } = useI18n();

const modelImage = ref("");
const input = ref("");

const send = async () => {
    let uuid = route.params.uuid;
    if (!uuid) {
        uuid = uuidv4();
        chat.isNewChat = true;
        await navigateTo(`/chat/${uuid}`)
    }

    chat.send(input.value, uuid, t);
    input.value = "";
};

watch(
    () => model.model,
    (newValue) => {
        if (newValue) {
            modelImage.value = `/model/${newValue.icon}.webp`;
        }
    }
);
onMounted(() => {
    model.getModelList();
});
</script>

<style lang="scss" scoped>
[data-theme="dark"] .panel {
    border: 1px solid #2b3039;
    background-color: #1d232a;

    .model {
        .dropdown {
            .dropdown-content {
                li:hover {
                    background-color: #2b3039;
                }
            }
        }
    }
    .button:hover {
        background-color: #2b3039;
    }
}
.panel {
    width: 700px;
    height: 52px;
    padding: 12px;
    display: flex;
    align-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    background-color: #ffffff;

    .model {
        width: 32px;
        height: 32px;
        cursor: pointer;

        .dropdown {
            .dropdown-content {
                width: 400px;
                max-height: 600px;
                padding: 0 12px;
                overflow: scroll;
                bottom: calc(100% + 24px);
                left: -10px;

                li {
                    padding: 12px;
                    border-radius: 12px;
                    transition: 0.2s;

                    .top {
                        display: flex;
                        margin-bottom: 4px;

                        img {
                            width: 42px;
                            height: 42px;
                        }
                        .text {
                            display: flex;
                            flex-direction: column;
                            margin-left: 12px;

                            .name {
                                font-weight: bold;
                            }
                            .namee {
                                font-size: 0.8rem;
                                color: #aab0bb;
                            }
                        }
                    }
                    p {
                        font-size: 0.8rem;
                        color: #6f757c;
                    }
                }
                li:hover {
                    background-color: #e5e7eb;
                }
                .active {
                    color: #ffffff;
                    background-color: #2b3440;
                }
                .active:hover {
                    background-color: #2b3440;
                }
            }
        }
    }
    form {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .inputBox {
            height: 42px;
            flex-grow: 1;

            .input {
                max-width: 100%;
                width: 100%;
                height: 100%;
                border-radius: 0;
                border: none;
                background-color: transparent;
            }
        }
        .button {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            transition: 0.2s;
            cursor: pointer;

            .icon {
                font-size: 1.2rem;
                color: #aab0bb;
            }
        }
        .button:hover {
            background-color: #e5e7eb;
        }
    }
}

@media (max-width: 900px) {
    .panel {
        width: 90vw;
    }
}
</style>
