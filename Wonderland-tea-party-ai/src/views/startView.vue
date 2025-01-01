<template>
    <div class="start">
        <p class="title">有什么我帮不上的？🥰</p>
        <userInput />
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { chatStore } from "@/stores/chatStores.js";
const chat = chatStore();

onMounted(async () => {
    chat.uuid = null;
    chat.messages = [];
});
</script>

<style lang="scss" scoped>
.start {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
        margin-bottom: 64px;
        font-size: 2rem;
    }
}
</style>
