import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/homeView.vue"),
            children: [
                {
                    path: "",
                    name: "start",
                    component: () => import("../views/startView.vue"),
                },
                {
                    path: "/chat/:uuid",
                    name: "chat",
                    component: () => import("../views/chatView.vue"),
                },
            ],
        },

        {
            path: "/login",
            name: "login",
            component: () => import("../views/loginView.vue"),
        },
    ],
});

export default router;

router.beforeEach((to, from) => {
    const token = localStorage.getItem("token");

    if (!token && to.name !== "login") {
        return { name: "login" };
    }
});