<template>
    <div class="chatMain">
        <div>
            <h1 class="neko">{{ neko }}</h1>
            <p class="model">{{ model.model.model }}</p>
            <p class="greetings">{{ greetings.at }}</p>
            <div class="suggested">
                <p class="title"><Icon name="mynaui:lightning" />{{ $t("client.chat.suggested.title") }}</p>
                <div class="list" ref="list">
                    <div class="card">
                        <p class="subTitle">{{ $t("client.chat.suggested.1.subTitle") }}</p>
                        <p class="info">{{ $t("client.chat.suggested.1.info") }}</p>
                        <span class="button" @click="showMessage">{{ $t("client.chat.suggested.button") }}</span>
                    </div>
                    <div class="card">
                        <p class="subTitle">{{ $t("client.chat.suggested.2.subTitle") }}</p>
                        <p class="info">{{ $t("client.chat.suggested.2.info") }}</p>
                        <span class="button" @click="showMessage">{{ $t("client.chat.suggested.button") }}</span>
                    </div>
                    <div class="card">
                        <p class="subTitle">{{ $t("client.chat.suggested.3.subTitle") }}</p>
                        <p class="info">{{ $t("client.chat.suggested.3.info") }}</p>
                        <span class="button" @click="showMessage">{{ $t("client.chat.suggested.button") }}</span>
                    </div>
                    <div class="card">
                        <p class="subTitle">{{ $t("client.chat.suggested.4.subTitle") }}</p>
                        <p class="info">{{ $t("client.chat.suggested.4.info") }}</p>
                        <span class="button" @click="showMessage">{{ $t("client.chat.suggested.button") }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth", "res-greetings-store"],
});

const greetings = useGreetingsStore();
const model = useModelStore();
const { t } = useI18n();

const neko = ref("");
const list = ref(null);
const showMessage = () => {
    message.info(t("client.chat.suggested.message"));
};

const handleWheel = (e) => {
    e.preventDefault();
    if (list.value) {
        list.value.scrollLeft += e.deltaY;
    }
};

onMounted(() => {
    list.value?.addEventListener("wheel", handleWheel, { passive: false });
    greetings.handleGreetings();
    neko.value = greetings.getNeko;
});
onUnmounted(() => {
    list.value?.removeEventListener("wheel", handleWheel);
});
</script>

<style lang="scss" scoped>
[data-theme="dark"] .chatMain {
    .suggested {
        .list {
            .card {
                border: 1px solid #2b3039;
            }
        }
    }
}

.chatMain {
    width: 400px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .neko {
        margin-top: 256px;
        margin-left: -18px;
        font-size: 4rem;
    }
    .model {
        font-size: 2rem;
        font-weight: bold;
    }
    .greetings {
        font-size: 1.4rem;
        opacity: 0.6;
    }
    .suggested {
        margin-top: 24px;

        .title {
            font-size: 18px;
            font-weight: bold;
            opacity: 0.8;
            display: flex;
            align-items: center;

            span {
                margin-right: 4px;
            }
        }
        .list {
            width: 900px;
            margin-top: 8px;
            margin-left: -12px;
            overflow: scroll;
            display: flex;
            -ms-overflow-style: none;
            scrollbar-width: none;
            mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), black 10px, black calc(100% - 10px), rgba(0, 0, 0, 0));
            -webkit-mask-image: linear-gradient(
                to right,
                rgba(0, 0, 0, 0),
                black 10px,
                black calc(100% - 10px),
                rgba(0, 0, 0, 0)
            );

            .card {
                width: 300px;
                height: 140px;
                padding: 24px;
                margin: 8px;
                border-radius: 12px;
                flex-shrink: 0;
                position: relative;
                border: 1px solid #e5e7eb;

                .subTitle {
                    font-size: 16px;
                    font-weight: bold;
                    opacity: 0.8;
                }
                .info {
                    margin-top: 4px;
                    opacity: 0.6;
                }
                .button {
                    position: absolute;
                    bottom: 12px;
                    right: 18px;
                    font-size: 0.9rem;
                    opacity: 0.8;
                    cursor: pointer;
                }
                .button:hover {
                    opacity: 1;
                }
            }
        }
        .list::-webkit-scrollbar {
            display: none;
        }
    }
}

@media (max-width: 900px) {
    .chatMain {
        width: 90vw;

        .neko {
            margin-top: 30vh;
        }
        .greetings {
            width: 90vw;
        }
        .suggested {
            display: none;
        }
    }
}
</style>
