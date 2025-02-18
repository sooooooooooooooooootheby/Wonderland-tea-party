import { defineStore } from "pinia";
import { message } from "ant-design-vue";

export const useModelStore = defineStore("model", {
    state: () => ({
        modelList: [],
        model: {},
    }),
    actions: {
        // 获取模型列表
        async getModelList() {
            const { $fetch } = useNuxtApp();
            const { t } = useI18n();

            try {
                const response = await $fetch("/api/model/getList");
                this.modelList = response.results;

                const selected = localStorage.getItem("model");
                if (selected) {
                    this.model = JSON.parse(selected);
                } else {
                    this.model = this.modelList[0];
                    localStorage.setItem("model", JSON.stringify(this.model));
                }
            } catch (error) {
                console.log(error);
                message.error(t("client.store.model.error1") + ":" + error.response._data.message);
            }
        },
        // 切换模型
        selectModel(model) {
            this.model = model;
            localStorage.setItem("model", JSON.stringify(model));
        },
    },
});
