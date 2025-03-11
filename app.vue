<template>
    <div>
        <div class="load" v-if="isLoading">
            <div class="neko">
                <randomNeko />
            </div>
            <div class="loading"></div>
        </div>
        <div v-else>
            <NuxtPage />
        </div>
    </div>
</template>

<script setup>
const isLoading = ref(true);

useHead({
    title: "wonderland-tea-party",
    meta: [{ name: "description", content: "这是一个ai聊天站点" }],
    link: [
        { rel: "shortcut icon", href: "/logo_small.webp" },
        { rel: "apple-touch-icon", href: "/logo_small.webp" },
    ],
    titleTemplate(titleChunk) {
        return titleChunk ? `${titleChunk} - s22y's webSite` : "s22y's webSite";
    },
});

onMounted(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute("data-theme", theme);
    }
    isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.load {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .neko {
        width: 128px;
        height: 128px;
        margin-bottom: 32px;
    }
}
</style>
