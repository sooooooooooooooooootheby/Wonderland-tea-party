import { defineStore } from "pinia";

export const useEditStore = defineStore("edit", {
    state: () => ({
        isOpen: false,
        input: ""
    }),
    actions: {
    },
});
