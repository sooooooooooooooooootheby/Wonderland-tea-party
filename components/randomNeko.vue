<template>
    <div class="nekos">
        <img :src="getSrc(list)" alt="neko" />
    </div>
</template>

<script setup>
const list = [
    "cat-with-tears-of-joy",
    "cat-with-wry-smile",
    "grinning-cat-with-smiling-eyes",
    "grinning-cat",
    "kissing-cat",
    "smiling-cat-with-heart-eyes",
];

const getSrc = (list) => {
    return `/neko/${list[Math.floor(Math.random() * list.length)]}.svg`;
};
</script>

<style lang="scss" scoped>
.nekos {
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
