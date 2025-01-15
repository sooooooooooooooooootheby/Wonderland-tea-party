import { defineStore } from "pinia";
import encryption from "s22y-utils";
import { message } from "ant-design-vue";

export const useUserStore = defineStore("user", {
    state: () => ({
    }),
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
                localStorage.setItem("username", response.username);
                navigateTo("/");
            } catch (error) {
                console.error(error);
                message.error(error.response._data.message);
            }
        },
    },
});
