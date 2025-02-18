import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    const expTime = decoded.exp;

    return expTime > currentTime;
};

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        if (!isAuthenticated()) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            return navigateTo("/auth");
        }
    }
});
