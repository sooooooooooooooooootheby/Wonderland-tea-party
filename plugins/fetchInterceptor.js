export default defineNuxtPlugin((nuxtApp) => {
    const customFetch = $fetch.create({
        async onRequest({ options }) {
            if (process.client) {
                const token = localStorage.getItem("token");
                if (token) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            }
        },
    });

    nuxtApp.provide("fetch", customFetch);
});