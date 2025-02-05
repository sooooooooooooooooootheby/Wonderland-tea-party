import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    compatibilityDate: "2025-01-12",
    modules: ["@pinia/nuxt", "@nuxt/icon", "@ant-design-vue/nuxt", "nuxt-monaco-editor"],

    css: ["highlight.js/styles/atom-one-dark.css", "~/assets/main.scss"],

    build: {
        transpile: ["resize-observer-polyfill"],
    },

    serverHandlers: [
        {
            route: "/api/*", // 设置你想匹配的路径
            handler: "~/server/middleware/auth.js", // 指定中间件的路径
        },
    ],

    runtimeConfig: {
        dashScopeApiKey: process.env.DASHSCOPE_API_KEY,
        githubApiKey: process.env.GITHUB_API_KEY,

        databaseHost: process.env.HOST,
        databaseUser: process.env.USER,
        databasePassword: process.env.PASSWORD,
        databaseDatabase: process.env.DATABASE,
        databaseCharset: process.env.CHARSET,

        tokenKey: process.env.TOKENKEY,
        tokenOutTime: process.env.TOKENOUTTIME,
    },

});