<template>
    <div class="chatIndex">
        <div class="chatMain">
            <p class="title">有什么帮不到你的😽</p>
            <div class="bar">
                <div class="button hvr-wobble-horizontal" @click="showMessage">创建图片</div>
                <div class="button hvr-wobble-horizontal" @click="showMessage">给我惊喜</div>
                <div class="button hvr-wobble-horizontal" @click="showMessage">帮我写</div>
                <div class="button hvr-wobble-horizontal" @click="showMessage">总结文本</div>
                <div class="button hvr-wobble-horizontal" @click="showMessage">分析数据</div>
            </div>
            <div class="input">
                <inputs/>
            </div>
        </div>
<!--        <edit/>-->
    </div>
</template>

<script setup>
import {message} from "ant-design-vue";

const showMessage = () => {
    message.info("开玩笑的 我们没有那种功能(目前, 未来也不一定)😸");
};
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

        .title {
            font-size: 2rem;
            font-weight: bold;
            color: #5D5D5D;
        }

        .bar {
            margin-top: 24px;

            .button {
                margin: 0 8px;
                padding: 8px 12px;
                border: 1px solid #e8e8e8;
                border-radius: 999px;
                box-shadow: 0 0 2px 1px #e8e8e8;
                cursor: pointer;
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
