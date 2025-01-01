<template>
    <el-container style="height: 100vh">
        <el-aside width="350px">
            <sider :uuid="route.params.uuid" />
        </el-aside>
        <el-container>
            <el-main style="padding: 0">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import sider from "@/components/sider.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss" scoped></style>
