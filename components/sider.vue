<template>
    <div class="siders">
        <div class="header">
            <img src="/logo_small.webp" alt="" />
            <div class="close" @click="hideSider">
                <Icon class="icon" name="mynaui:x" />
            </div>
        </div>
        <button class="btn btn-neutral" @click="navigateTo('/chat')">
            <Icon class="icon" name="mynaui:plus" />{{ $t("client.sider.new") }}
        </button>
        <div class="list">
            <ul v-if="chat.isChatList">
                <li v-for="(item, index) in chat.chatList" :key="index" class="day">
                    <div class="time">{{ item.date }}</div>
                    <ul>
                        <li
                            v-for="(items, indexs) in item.items"
                            :key="indexs"
                            class="content"
                            :class="{ active: items.uuid === route.params.uuid }"
                        >
                            <div class="text" @click="navigateTo(`/chat/${items.uuid}`)">
                                <Icon class="icon" name="mynaui:message-dots" />
                                <span>{{ items.content }}</span>
                            </div>
                            <div class="button" :onclick="`${'a' + items.uuid.split('-')[0]}.showModal()`">
                                <Icon class="icon" name="mynaui:trash-two-solid" />
                            </div>
                            <dialog :id="'a' + items.uuid.split('-')[0]" class="modal modal-bottom sm:modal-middle">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">{{ $t("client.sider.del.title") }}</h3>
                                    <p class="py-4">{{ $t("client.sider.del.p") }}</p>
                                    <form method="dialog" class="form">
                                        <button class="btn">{{ $t("client.sider.del.button1") }}</button>
                                        <button class="btn exit" @click="delChat(items.uuid)">
                                            {{ $t("client.sider.del.button2") }}
                                        </button>
                                    </form>
                                </div>
                            </dialog>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading" v-else></div>
        </div>
        <div class="bottom">
            <ul>
                <li class="item" @click="devTool = !devTool">
                    <Icon class="icon" name="mynaui:tool-solid" />
                    <span class="text">Developer tools</span>
                </li>
                <div class="dropdown dropdown-right dropdown-end">
                    <li tabindex="0" role="button" class="item">
                        <Icon class="icon" name="flowbite:language-outline" /><span class="text">{{
                            $t("client.sider.lang")
                        }}</span>
                    </li>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a @click="setLocale('zh')">简体中文</a></li>
                        <li><a @click="setLocale('en')">English</a></li>
                    </ul>
                </div>
                <label for="theme-toggle">
                    <li class="item">
                        <Icon class="icon" name="mynaui:moon-star-solid" />
                        <span class="text">{{ $t("client.sider.theme") }}</span>
                        <input
                            type="checkbox"
                            id="theme-toggle"
                            class="toggle theme-controller"
                            @click="handleTheme"
                            v-model="isDarkTheme"
                        />
                    </li>
                </label>
                <li class="item logout" onclick="logout.showModal()">
                    <Icon class="icon" name="mynaui:logout-solid" /><span class="text">{{ $t("client.sider.logout") }}</span>
                </li>
                <dialog id="logout" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <h3 class="text-lg font-bold">{{ $t("client.sider.out.title") }}</h3>
                        <p class="py-4">{{ $t("client.sider.out.p") }}</p>
                        <div class="bar">
                            <form method="dialog">
                                <button class="btn">{{ $t("client.sider.out.button1") }}</button>
                            </form>
                            <button class="btn exit" @click="handleLogout">{{ $t("client.sider.out.button2") }}</button>
                        </div>
                    </div>
                </dialog>
            </ul>
        </div>
        <a-drawer
            v-model:open="devTool"
            class="custom-class"
            root-class-name="root-class-name"
            title="developer tools"
            placement="right"
        >
            <code>chat list: {{ chat.chatList }}</code>
            <br />
            <br />
            <code>chat: {{ chat.chat }}</code>
        </a-drawer>
    </div>
</template>

<script setup>
const emit = defineEmits(["cutSider"]);
const chat = useChatStore();
const route = useRoute();
const { t, setLocale } = useI18n();

const isDarkTheme = ref(false);
const devTool = ref(false);

const handleTheme = () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
};

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    navigateTo("/auth");
};

const delChat = async (uuid) => {
    const { $fetch } = useNuxtApp();

    try {
        const results = await $fetch(`/api/chat/delChat`, {
            method: "POST",
            body: JSON.stringify({
                uuid,
            }),
        });

        if (results.result) {
            message.success(t("client.store.chat.success1"));
            chat.chatList = chat.chatList.map((chatGroup) => {
                return {
                    ...chatGroup,
                    items: chatGroup.items.filter((item) => item.uuid !== uuid),
                };
            });
        } else {
            message.error(t("client.store.chat.error4"));
        }
    } catch (error) {
        message.error(t("client.store.chat.error4"));
        console.error(error);
    }
};

const hideSider = () => {
    emit("cutSider");
};

onMounted(() => {
    chat.getList();

    const theme = localStorage.getItem("theme");
    if (theme && theme === "dark") {
        isDarkTheme.value = true;
    }
});
</script>

<style lang="scss" scoped>
[data-theme="dark"] .siders {
    border: 1px solid #2b3039;

    .list {
        ul {
            .day {
                border-top: 1px solid #2b3039;

                .content:hover {
                    background-color: #2b3039;
                }
            }
        }
    }
    .bottom {
        border-top: 1px solid #2b3039;

        ul {
            li:hover {
                background-color: #2b3039;
            }
        }
    }
}
.siders {
    width: 100%;
    height: 100%;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    padding: 14px;
    display: flex;
    flex-direction: column;

    .header {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        img {
            width: 48px;
            height: 48px;
            border-radius: 999px;
        }
        .close {
            width: 32px;
            height: 32px;
            margin-right: 12px;
            display: none;
            align-items: center;
            justify-content: center;
            border-radius: 8px;

            .icon {
                font-size: 1.4rem;
            }
        }
        .close:hover {
            background-color: #e5e7eb;
        }
    }
    .btn {
        width: 100%;
        border-radius: 16px;

        .icon {
            font-size: 1.2rem;
        }
    }
    .list {
        width: 100%;
        margin: 12px 0;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        overflow: scroll;
        mask-image: linear-gradient(to top, rgba(0, 0, 0, 0), black 40px, black calc(100% - 10px), rgba(0, 0, 0, 0));
        -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0), black 40px, black calc(100% - 10px), rgba(0, 0, 0, 0));

        ul {
            width: 100%;
            margin-top: 4px;

            .day {
                border-top: 1px solid #e5e7eb;
                margin-bottom: 12px;

                .time {
                    margin-left: 8px;
                    padding-top: 6px;
                    opacity: 0.8;
                }
                .content {
                    display: flex;
                    margin: 2px 0;
                    padding: 6px 8px;
                    border-radius: 12px;
                    transition: 0.2s;
                    cursor: pointer;

                    .text {
                        width: 80%;
                        display: flex;
                        align-items: center;
                        flex-grow: 1;
                        .icon {
                            flex-shrink: 0;
                            margin-right: 4px;
                            font-size: 17px;
                        }
                        span {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .button {
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 1;
                        color: #ff5861;
                        border-radius: 12px;

                        .icon {
                            font-size: 17px;
                        }
                    }
                    .button:hover {
                        background-color: #ff58602f;
                    }
                    .modal {
                        .modal-box {
                            .form {
                                display: flex;
                                justify-content: flex-end;

                                .btn {
                                    width: auto;
                                }
                                .exit {
                                    margin-left: 12px;
                                    color: #ff5861;
                                    background-color: #ff58602f;
                                }
                                .exit:hover {
                                    border-color: #ff5861;
                                }
                            }
                        }
                    }
                }
                .content:hover {
                    background-color: #e5e7eb;
                }
                .active {
                    background-color: #2b3440d8;

                    .text {
                        color: #ffffff;
                    }
                }
                .active:hover {
                    background-color: #2b3440d8;
                }
            }
        }
        .loading {
            margin-top: 12px;
        }
    }
    .bottom {
        width: 100%;
        padding-top: 14px;
        border-top: 1px solid #e5e7eb;

        ul {
            .item {
                list-style: none;
                margin: 2px 0;
                padding: 6px 8px;
                display: flex;
                align-items: center;
                border-radius: 12px;
                transition: 0.2s;
                cursor: pointer;

                .icon {
                    margin-right: 4px;
                    font-size: 1.2rem;
                }
                .text {
                    flex-grow: 1;
                }
                .toggle {
                    scale: 0.8;
                }
            }
            .item:hover {
                background-color: #e5e7eb;
            }
            .logout {
                color: #ff5861;
            }
            .logout:hover {
                background-color: #ff58602f;
            }
            .modal {
                .modal-box {
                    .bar {
                        display: flex;
                        justify-content: flex-end;

                        .exit {
                            width: auto;
                            margin-left: 12px;
                            color: #ff5861;
                            background-color: #ff58602f;
                        }
                        .exit:hover {
                            border-color: #ff5861;
                        }
                    }
                }
            }
        }
        .dropdown {
            width: 100%;

            .dropdown-content {
                bottom: 42px;
                left: 0;
            }
        }
    }
}

@media (max-width: 900px) {
    .siders {
        height: 100vh;
        border: none;
        border-right: 1px solid #e5e7eb;
        border-radius: 0;

        .header {
            .close {
                display: flex;
            }
        }
        .bottom {
            .dropdown {
                .dropdown-content {
                    left: 0;
                }
            }
        }
    }
}
</style>
