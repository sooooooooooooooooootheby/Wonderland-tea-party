import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useGreetingsStore = defineStore("greetings", {
    state: () => ({
        greetings: [
            // 早上问候
            {
                type: "morning",
                message: {
                    zh: "早安呀~今天也要元气满满哦! 😊",
                    en: "Good morning! Let's start the day with full energy! 😊",
                },
            },
            {
                type: "morning",
                message: {
                    zh: "美好的一天从早晨开始呢! 🌞",
                    en: "A wonderful day begins in the morning! 🌞",
                },
            },
            {
                type: "morning",
                message: {
                    zh: "早安!记得吃早餐才有力气工作学习喵~ 🥐",
                    en: "Good morning! Remember to eat breakfast to stay energized for work and study~ 🥐",
                },
            },

            // 中午问候
            {
                type: "noon",
                message: {
                    zh: "中午好~肚子饿了吗?要按时吃饭哦! 🍽️",
                    en: "Good afternoon~ Are you hungry? Remember to eat on time! 🍽️",
                },
            },
            {
                type: "noon",
                message: {
                    zh: "午安!休息一下补充能量吧! ⚡",
                    en: "Good noon! Take a break and recharge your energy! ⚡",
                },
            },
            {
                type: "noon",
                message: {
                    zh: "午餐时间到啦~今天想吃什么好吃的呢? 🍜",
                    en: "It's lunch time~ What delicious food are you craving today? 🍜",
                },
            },

            // 午后问候
            {
                type: "afternoon",
                message: {
                    zh: "下午好! 工作 or 学习顺利吗喵? 📚",
                    en: "Good afternoon! How's your work or study going? 📚",
                },
            },
            {
                type: "afternoon",
                message: {
                    zh: "午后时光真美好喵~喝杯茶休息一下吧! 🍵",
                    en: "The afternoon is so lovely~ Take a break and enjoy a cup of tea! 🍵",
                },
            },
            {
                type: "afternoon",
                message: {
                    zh: "下午好! 让我们继续加油喵~ 💪",
                    en: "Good afternoon! Let's keep up the good work~ 💪",
                },
            },

            // 晚上问候
            {
                type: "night",
                message: {
                    zh: "晚安~祝你有个好梦! 🌙",
                    en: "Good night~ Sweet dreams! 🌙",
                },
            },
            {
                type: "night",
                message: {
                    zh: "辛苦一天了，早点休息吧! 😴",
                    en: "You've worked hard today, get some rest early! 😴",
                },
            },
            {
                type: "night",
                message: {
                    zh: "夜晚静悄悄，愿你睡个好觉喵~ 🌃",
                    en: "The night is quiet, may you sleep well~ 🌃",
                },
            },

            // 随机问候
            {
                type: "random",
                message: {
                    zh: "见到你真开心呢! 😄",
                    en: "So happy to see you! 😄",
                },
            },
            {
                type: "random",
                message: {
                    zh: "今天天气不错，心情也跟着明朗起来了! ☀️",
                    en: "The weather is nice today, and my mood is brightening up! ☀️",
                },
            },
            {
                type: "random",
                message: {
                    zh: "希望你每一天都充满阳光和欢笑! 🌈",
                    en: "May every day be filled with sunshine and laughter for you! 🌈",
                },
            },
            {
                type: "random",
                message: {
                    zh: "有什么烦恼都可以跟我说说看喵~ 🐾",
                    en: "If you have any worries, feel free to share with me~ 🐾",
                },
            },
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
        currentLanguage: () => {
            const cookie = useCookie("i18n_redirected");
            return cookie.value || "en";
        },
        getTimeGreetings() {
            const lang = this.currentLanguage;
            const currentHour = new Date().getHours();

            let filteredGreetings = [];

            if (Math.random() < 0.5) {
                if (currentHour < 12) {
                    filteredGreetings = this.greetings.filter((g) => g.type === "morning");
                } else if (currentHour < 14) {
                    filteredGreetings = this.greetings.filter((g) => g.type === "noon");
                } else if (currentHour < 18) {
                    filteredGreetings = this.greetings.filter((g) => g.type === "afternoon");
                } else {
                    filteredGreetings = this.greetings.filter((g) => g.type === "night");
                }
            } else {
                filteredGreetings = this.greetings.filter((g) => g.type === "random");
            }

            const selected = filteredGreetings[Math.floor(Math.random() * filteredGreetings.length)];

            return {
                ...selected,
                message: selected.message[lang],
            };
        },
        getNeko() {
            return this.neko[Math.floor(Math.random() * this.neko.length)];
        },
    },
});
