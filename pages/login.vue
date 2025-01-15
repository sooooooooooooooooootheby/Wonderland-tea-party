<template>
    <div class="login">
        <div class="icon">😺</div>
        <span class="title">欢迎回来</span>
        <div class="form">
            <a-input class="input" v-model:value="username" placeholder="用户名" />
            <a-input-password class="input" v-model:value="password" placeholder="密码" />
            <a-button class="input" type="primary" @click="user.login(username, password)">继续</a-button>
        </div>
    </div>
</template>

<script setup>
const user = useUserStore();

const username = ref("");
const password = ref("");
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon {
        font-size: 3rem;
        position: absolute;
        top: 32px;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        color: #2d333a;
        margin-bottom: 12px;
    }

    .form {
        width: 300px;
        display: flex;
        flex-direction: column;

        .input {
            width: 100%;
            height: 48px;
            margin: 8px 0;
        }
    }
}
</style>
