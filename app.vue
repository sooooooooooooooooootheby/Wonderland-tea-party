<template>
    <div>
        <NuxtPage />
    </div>
</template>

<script setup>
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
});
</script>

<style lang="scss" scoped></style>
