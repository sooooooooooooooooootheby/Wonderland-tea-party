<template>
    <a-config-provider
        :theme="{
            token: {
                colorPrimary: '#5D5D5D',
            },
        }"
    >
        <NuxtPage />
    </a-config-provider>
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
</script>

<style lang="scss" scoped></style>
