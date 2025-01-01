<template>
    <div class="app">
        <div class="bgColor"></div>
        <div class="bg"></div>
    </div>
    <router-view />
</template>

<script setup></script>

<style lang="scss" scoped>
.bgColor {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    background-color: #292A2E;
}
.bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-image: url("/13.svg");
    background-repeat: repeat;
    background-size: 20%;
    opacity: 0.2;
}
</style>
