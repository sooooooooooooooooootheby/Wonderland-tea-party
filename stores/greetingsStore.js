import { defineStore } from "pinia";

export const useGreetingsStore = defineStore("greetings", {
    state: () => ({
        greetings: [
            // 早上问候
            { type: "morning", message: "早安呀~今天也要元气满满哦!" },
            { type: "morning", message: "美好的一天从早晨开始呢!" },
            { type: "morning", message: "早安!记得吃早餐才有力气工作学习喵~" },

            // 中午问候
            { type: "noon", message: "中午好~肚子饿了吗?要按时吃饭哦!" },
            { type: "noon", message: "午安!休息一下补充能量吧!" },
            { type: "noon", message: "午餐时间到啦~今天想吃什么好吃的呢?" },

            // 午后问候
            { type: "afternoon", message: "下午好! 工作 or 学习顺利吗喵?" },
            { type: "afternoon", message: "午后时光真美好喵~喝杯茶休息一下吧!" },
            { type: "afternoon", message: "下午好! 让我们继续加油喵~" },

            // 晚上问候
            { type: "night", message: "晚安~祝你有个好梦!" },
            { type: "night", message: "辛苦一天了，早点休息吧!" },
            { type: "night", message: "夜晚静悄悄，愿你睡个好觉喵~" },

            // 随机问候
            { type: "random", message: "见到你真开心呢!" },
            { type: "random", message: "今天天气不错，心情也跟着明朗起来了!" },
            { type: "random", message: "希望你每一天都充满阳光和欢笑!" },
            { type: "random", message: "有什么烦恼都可以跟我说说看喵~" },
        ],
        neko: ["😺", "😸", "😻", "😽"],
        at: "",
    }),
    actions: {
        handleGreetings() {
            const g = this.getTimeGreetings;
            let index = 0;
            const interval = setInterval(() => {
                if (index < g.message.length) {
                    this.at += g.message[index];
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 200);
        },
    },
    getters: {
        getTimeGreetings() {
            if (Math.random() < 0.5) {
                const currentHour = new Date().getHours();
                const greetings = this.greetings.filter((greeting) => {
                    if (currentHour < 12) {
                        return greeting.type === "morning";
                    } else if (currentHour < 14) {
                        return greeting.type === "noon";
                    } else if (currentHour < 18) {
                        return greeting.type === "afternoon";
                    } else {
                        return greeting.type === "night";
                    }
                });
                return greetings[Math.floor(Math.random() * greetings.length)];
            } else {
                const randomGreetings = this.greetings.filter((greeting) => greeting.type === "random");
                return randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
            }
        },
        getRandom() {
            return this.greetings[Math.floor(Math.random) * greetings.filter((g) => g.type === "random").length];
        },
        getNeko() {
            return this.neko[Math.floor(Math.random() * this.neko.length)];
        },
    },
});
