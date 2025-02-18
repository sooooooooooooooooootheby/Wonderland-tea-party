export default defineI18nLocaleDetector((event, config) => {
    const cookie = tryCookieLocale(event, { lang: "", name: "i18n_locale" });
    if (cookie) {
        return cookie.toString();
    }

    const header = tryHeaderLocale(event, { lang: "" });
    if (header) {
        return header.toString();
    }

    return config.defaultLocale;
});
