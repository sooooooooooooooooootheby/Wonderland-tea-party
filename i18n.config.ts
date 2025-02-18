import zh from "~/i18n/zh.json";
import en from "~/i18n/en.json";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: "en",
    messages: {
        en,
        zh,
    }
}));
