import "./assets/main.scss";
import "vue-devui/style.css";
import "@devui-design/icons/icomoon/devui-icon.css";
import "devui-theme/styles-var/devui-var.scss";
import "element-plus/dist/index.css";
import 'highlight.js/styles/atom-one-dark.css';

import { createApp } from "vue";
import { createPinia } from "pinia";

// dev ui theme
import { ThemeServiceInit, infinityTheme, galaxyTheme } from "devui-theme";
const themeService = ThemeServiceInit({ infinityTheme }, "infinityTheme");
themeService.applyTheme(galaxyTheme);

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

import input from "vue-devui/input";
app.use(input);

app.mount("#app");
