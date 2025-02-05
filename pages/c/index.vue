<template>
    <div class="chatIndex">
        <div class="chatMain">
            <div class="hi">
                <p class="neko">{{ greetings.getNeko }}</p>
                <p class="model">{{ model.selectedModel.name }}</p>
                <p class="greetings">{{ greetings.at }}</p>
                <div class="suggested">
                    <p class="title"><Icon name="mynaui:lightning" />建议</p>
                    <div class="list" ref="list">
                        <div class="card">
                            <p class="subTitle">创建图片</p>
                            <p class="info">给我一些文本, 我给你生成一些图片.</p>
                            <span class="btn" @click="showMessage">尝试一下?</span>
                        </div>
                        <div class="card">
                            <p class="subTitle">敲敲代码</p>
                            <p class="info">说出你的需求, 让我来帮助你!</p>
                            <span class="btn" @click="showMessage">尝试一下?</span>
                        </div>
                        <div class="card">
                            <p class="subTitle">总结文本</p>
                            <p class="info">文本量太大了? 让我来帮你总结这一大堆文本都在说什么</p>
                            <span class="btn" @click="showMessage">尝试一下?</span>
                        </div>
                        <div class="card">
                            <p class="subTitle">分析数据</p>
                            <p class="info">懒得研究数据? 让我看看!</p>
                            <span class="btn" @click="showMessage">尝试一下?</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="input">
                <inputs />
            </div>
        </div>
        <edit />
    </div>
</template>

<script setup>
import { message } from "ant-design-vue";

const model = useModelStore();
const greetings = useGreetingsStore();

const list = ref(null);

const showMessage = () => {
    message.info("开玩笑的 我们没有那种功能(目前, 未来也不一定)😸");
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
});

onUnmounted(() => {
    list.value?.removeEventListener("wheel", handleWheel);
});
</script>

<style lang="scss" scoped>
.chatIndex {
    width: 100%;
    height: 100%;
    display: flex;

    .chatMain {
        min-width: 900px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .hi {
            margin: 0 64px;

            .neko {
                font-size: 3rem;
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
                    overflow: scroll;
                    display: flex;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    mask-image: linear-gradient(
                        to right,
                        rgba(0, 0, 0, 0),
                        black 10px,
                        black calc(100% - 10px),
                        rgba(0, 0, 0, 0)
                    );
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
                        background-color: #f4f4f4;
                        border-radius: 12px;
                        flex-shrink: 0;
                        position: relative;

                        .subTitle {
                            font-size: 16px;
                            font-weight: bold;
                            opacity: 0.8;
                        }
                        .info {
                            margin-top: 4px;
                            opacity: 0.6;
                        }
                        .btn {
                            position: absolute;
                            bottom: 24px;
                            right: 28px;
                            opacity: 0.8;
                            cursor: pointer;
                        }
                        .btn:hover {
                            opacity: 1;
                        }
                    }
                }
                .list::-webkit-scrollbar {
                    display: none;
                }
            }
        }

        .input {
            position: fixed;
            bottom: 12px;
            transform: translateX(-50%);
        }
    }
}

/* Wobble Horizontal */
@-webkit-keyframes hvr-wobble-horizontal {
    16.65% {
        -webkit-transform: translateX(8px);
        transform: translateX(8px);
    }
    33.3% {
        -webkit-transform: translateX(-6px);
        transform: translateX(-6px);
    }
    49.95% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
    }
    66.6% {
        -webkit-transform: translateX(-2px);
        transform: translateX(-2px);
    }
    83.25% {
        -webkit-transform: translateX(1px);
        transform: translateX(1px);
    }
    100% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
}

@keyframes hvr-wobble-horizontal {
    16.65% {
        -webkit-transform: translateX(8px);
        transform: translateX(8px);
    }
    33.3% {
        -webkit-transform: translateX(-6px);
        transform: translateX(-6px);
    }
    49.95% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
    }
    66.6% {
        -webkit-transform: translateX(-2px);
        transform: translateX(-2px);
    }
    83.25% {
        -webkit-transform: translateX(1px);
        transform: translateX(1px);
    }
    100% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
}

.hvr-wobble-horizontal {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}

.hvr-wobble-horizontal:focus,
.hvr-wobble-horizontal:active {
    -webkit-animation-name: hvr-wobble-horizontal;
    animation-name: hvr-wobble-horizontal;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
}
</style>
