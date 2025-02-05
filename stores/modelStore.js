import { defineStore } from "pinia";
import { message } from "ant-design-vue";

export const useModelStore = defineStore("model", {
    state: () => ({
        modelList: [],
        selectedModel: {},
    }),
    actions: {
        // 获取模型列表
        async getModelList() {
            try {
                const res = await $fetch("/api/model/getModelList", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                this.modelList = res.results;
                this.selectedModel = this.modelList[0];
            } catch (error) {
                message.error(`获取模型列表出错: ${error}`);
            }
        },
    },
});
