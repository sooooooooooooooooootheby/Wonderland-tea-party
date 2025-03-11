import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
        "@nuxt/icon",
        "@ant-design-vue/nuxt",
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
    ],

    build: {
        transpile: ["vuetify", "vue"],
    },

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },

    css: ["~/assets/main.scss", "~/assets/prism.scss"],

    plugins: ["~/plugins/fetchInterceptor.js"],

    i18n: {
        vueI18n: "./i18n.config.ts",
        locales: ["en", "zh"],
        defaultLocale: "en",
        experimental: {
            localeDetector: "localeDetector.ts",
        },
    },

    serverHandlers: [
        {
            route: "/api/*",
            handler: "~/server/middleware/auth.js",
        },
        {
            route: "/api/admin/*",
            handler: "~/server/middleware/isAdmin.js",
        },
    ],

    runtimeConfig: {
        qwenKey: process.env.QWEN_API_KEY,
        deepseekKey: process.env.DEEPSEEK_API_KEY,

        databaseHost: process.env.HOST,
        databaseUser: process.env.USER,
        databasePassword: process.env.PASSWORD,
        databaseDatabase: process.env.DATABASE,
        databaseCharset: process.env.CHARSET,

        tokenKeyServer: process.env.TOEKNKEY_SERVER,
        tokenOutTime: process.env.TOKENOUTTIME,

        public: {
            tokenKeyClient: process.env.TOEKNKEY_CLIENT,
        },
    },
});
