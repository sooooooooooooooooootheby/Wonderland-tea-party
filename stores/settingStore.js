import { defineStore } from "pinia";
import { message } from "ant-design-vue";

export const useSettingStore = defineStore("setting", {
    state: () => ({
        user: {
            isRegister: null,
        },
    }),
    actions: {
        async getSetting() {
            try {
                const response = await $fetch(`/api/admin/getSetting`);

                if (response.user && response.user.length > 0) {
                    const firstUser = response.user[0];
                    this.setUserProperties(firstUser);
                }
            } catch (error) {
                console.error("设置项获取失败" + error);
                message.error("设置项获取失败" + error);
            }
        },
        async putSetting(key, value) {
            try {
                const results = await $fetch(`/api/admin/putSetting`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        key,
                        value,
                    }),
                });
            } catch (error) {
                console.error(key + " 修改失败" + error);
                message.error(key + " 修改失败" + error);
            }
        },
        setUserProperties(user) {
            // 定义允许更新的字段白名单
            const allowedFields = ["isRegister"]; // 根据实际需求添加更多字段

            // 创建一个新的对象用于保存更新后的属性
            const updatedUser = {};

            // 遍历白名单中的字段并更新
            for (const field of allowedFields) {
                if (field in user) {
                    // 特殊处理布尔值类型的字段
                    if (field === "isRegister") {
                        updatedUser[field] = Boolean(Number(user[field]));
                    } else {
                        updatedUser[field] = user[field];
                    }
                }
            }

            // 更新 state 中的 user 对象
            this.user = {
                ...this.user,
                ...updatedUser,
            };
        },
    },
});
