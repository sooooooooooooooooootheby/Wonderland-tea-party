<template>
    <div class="chat">
        <div class="sider" :class="{ hide: isHide }">
            <sider @cutSider="cutSider" />
        </div>
        <div class="main" v-if="isHide">
            <div class="header">
                <div class="openSider" @click="cutSider">
                    <Icon class="icon" name="mynaui:menu-solid" />
                </div>
                <div class="title" v-if="chat.chat && chat.chat.length > 0">
                    {{ chat.chat[0].content }}
                </div>
            </div>
            <NuxtPage />
            <div class="panel">
                <panel />
            </div>
        </div>
    </div>
</template>

<script setup>
const chat = useChatStore();

const isHide = ref(true);

const cutSider = () => {
    isHide.value = !isHide.value;
};
</script>

<style lang="scss" scoped>
.chat {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    padding: 0;
    display: flex;

    .sider {
        width: 300px;
        height: 100vh;
        padding: 12px;
        flex-shrink: 0;
        overflow: hidden;
    }
    .main {
        width: 100%;
        height: 100vh;
        position: relative;

        .header {
            width: 100vw;
            height: 64px;
            padding: 0 24px;
            display: none;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            border-bottom: 1px solid #e5e7eb;
            background-color: #ffffff;

            .openSider {
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
            .openSider:hover {
                background-color: #e5e7eb;
            }
            .title {
                margin-left: 12px;
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .panel {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}

@media (max-width: 900px) {
    .chat {
        column-gap: 0;

        .sider {
            width: 100vw;
            padding: 0;
            transition: 0.2s;
        }
        .hide {
            width: 0;
        }
        .main {
            width: 100vw;
            overflow: hidden;

            .header {
                display: flex;

                .openSider {
                    display: flex;
                }
            }
        }
    }
}
</style>
