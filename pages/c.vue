<template>
    <a-layout class="layout">
        <a-layout-sider class="sider" :width="siderWidth">
            <sider @updateSiderWidth="updateSiderWidth" />
        </a-layout-sider>
        <a-layout style="background-color: #FFFFFF;">
            <a-layout-content>
                <NuxtPage />
            </a-layout-content>
            <div class="panel">
                <div class="icons" @click="updateSiderWidth('260px')" v-if="siderWidth === '0px'">
                    <Icon class="icon" name="mynaui:panel-left-open-solid" />
                </div>
            </div>
        </a-layout>
    </a-layout>
</template>

<script setup>
const chat = useChatStore();
definePageMeta({
    middleware: "auth",
});

const siderWidth = ref("260px");

const updateSiderWidth = (value) => {
    siderWidth.value = value;
}
</script>

<style lang="scss" scoped>
.layout {
    width: 100vw;
    height: 100vh;

    .sider {
        z-index: 1;
        background-color: #F9F9F9;
    }

    .panel {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 0;
    }
}
</style>
