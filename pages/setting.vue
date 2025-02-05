<template>
    <div class="setting">
        <div class="sider">
            <div class="header">
                <div class="icons" @click="navigateTo('/c')">
                    <Icon class="icon" name="mynaui:corner-up-left-solid" />
                </div>
            </div>
            <ul class="menu">
                <li class="item" :class="{ isActive: route.path === '/setting' }" @click="navigateTo('/setting')">
                    <Icon class="icon" name="uil:setting" />
                    <span>基础设置</span>
                </li>
                <li class="item" :class="{ isActive: route.path === '/setting/model' }" @click="navigateTo('/setting/model')">
                    <Icon class="icon" name="uil:robot" />
                    <span>模型管理</span>
                </li>
                <li class="item" :class="{ isActive: route.path === '/setting/user' }" @click="navigateTo('/setting/user')">
                    <Icon class="icon" name="uil:user" />
                    <span>用户管理</span>
                </li>
            </ul>
        </div>
        <div class="main">
            <div class="content">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
</script>

<style lang="scss" scoped>
.setting {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;

    .sider {
        width: 260px;
        height: 100vh;
        background-color: #f9f9f9;

        .header {
            padding: 10px;
            display: flex;
            align-items: center;
        }
        .menu {
            padding: 10px;

            .item {
                list-style: none;
                display: flex;
                margin: 2px 0;
                padding: 6px 8px;
                border-radius: 8px;
                opacity: 0.8;
                transition: 0.2s;
                cursor: pointer;

                .icon {
                    font-size: 20px;
                    margin-right: 8px;
                }
            }
            .item:hover {
                background-color: rgba(224, 224, 224, 0.5);
            }
            .isActive {
                opacity: 1;
                background-color: #e0e0e0 !important;
            }
        }
    }
    .main {
        width: calc(100vw - 260px);
        height: 100vh;

        .content {
            min-width: 800px;
            margin: 0 auto;
            margin-top: 48px;
        }
    }
}
</style>
