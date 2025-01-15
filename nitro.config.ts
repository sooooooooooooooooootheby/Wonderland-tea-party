import { defineNitroConfig } from "nitropack";

export default defineNitroConfig({
    vercel: {
        functions: {
            maxDuration: 60,
        },
    },
});
