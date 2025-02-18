export default defineNuxtRouteMiddleware((to, from) => {
    const i18nRedirected = useCookie("i18n_redirected").value;

    if (i18nRedirected && i18nRedirected !== "en") {
        const path = to.path;

        if (!path.startsWith(`/${i18nRedirected}`)) {
            const newPath = `/${i18nRedirected}${path}`;
            return navigateTo(newPath);
        }
    }
});
