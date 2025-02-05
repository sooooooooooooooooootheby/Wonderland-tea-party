import { defineStore } from "pinia";
import encryption from "s22y-utils";
import { message } from "ant-design-vue";
import { jwtDecode } from "jwt-decode";
import { useChatStore } from "./chatStore.js";
import { useEditStore } from "./editStore.js";
import { useGreetingsStore } from "./greetingsStore.js";
import { useModelStore } from "./modelStore.js";

export const useUserStore = defineStore("user", {
    state: () => ({}),
    actions: {
        async login(username, password) {
            if (!username) {
                return message.warning("没有用户名");
            }
            if (!password) {
                return message.warning("没有密码");
            }

            password = encryption.passwordHash(password, "typhon");

            try {
                const response = await $fetch("/api/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                message.success("登录成功 🎉");
                localStorage.setItem("token", response.token);
                localStorage.setItem("uid", response.uid);

                navigateTo("/");
            } catch (error) {
                console.error(error);
                message.error(error.response._data.message);
            }
        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("uid");

            const chatStore = useChatStore();
            const editStore = useEditStore();
            const greetingsStore = useGreetingsStore();
            const modelStore = useModelStore();

            chatStore.$reset();
            editStore.$reset();
            greetingsStore.$reset();
            modelStore.$reset();
            this.$reset();

            navigateTo("/login");
        },
    },
    getters: {
        isAdmin: () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.role === "admin";
            } catch (error) {
                console.error("Failed to decode token:", error);
                return false;
            }
        },
    },
});
