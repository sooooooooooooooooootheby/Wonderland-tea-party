<template>
    <div class="login">
        <div class="panel">
            <d-input
                class="input"
                v-model="password"
                @keydown.enter="handleLogin"
                placeholder="Password"
                show-password
            ></d-input>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Axios from "../utils/axios.js";
import { ElMessage } from "element-plus";
import sha256 from "crypto-js/sha256.js";
import Base64 from "crypto-js/enc-base64.js";
import { useRouter } from "vue-router";

const router = useRouter();
const password = ref("");

const handleLogin = async () => {
    if (!password.value) {
        ElMessage.error("看起来你还没有输入密码 😑");
    }

    let saltPassword = password.value + "Alice";
    saltPassword = Base64.stringify(sha256(saltPassword));

    try {
        const res = await Axios.post("/user/login", {
            password: saltPassword,
        });
        ElMessage.success("登录成功! 🎉");
        localStorage.setItem("token", res.token);
        router.push({ name: "home" });
        // if ()
    } catch (error) {
        ElMessage.error(error);
    }
};
</script>

<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    position: fixed;
    backdrop-filter: blur(18px);
    display: flex;
    justify-content: center;
    align-items: center;

    .panel {
        width: 300px;
    }
}
</style>
