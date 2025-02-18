<template>
    <div class="auth">
        <div class="control">
            <div class="lang">
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button">
                        <Icon class="icon" name="flowbite:language-outline" />
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a @click="setLocale('zh')">简体中文</a></li>
                        <li><a @click="setLocale('en')">English</a></li>
                    </ul>
                </div>
            </div>
            <div class="theme">
                <label class="swap swap-rotate">
                    <input type="checkbox" class="theme-controller" @click="handleTheme" />

                    <Icon class="swap-off fill-current icon" name="mynaui:sun-solid" />
                    <Icon class="swap-on fill-current icon" name="mynaui:moon-solid" />
                </label>
            </div>
        </div>
        <form class="form" @submit.prevent="handleSubmit">
            <h1>Wonderland Tea Party</h1>
            <p>{{ $t("client.auth.welcome") }} 😽</p>
            <div class="in">
                <div class="label">
                    <span class="label-text">{{ $t("client.auth.username") }}</span>
                </div>
                <input type="text" class="input input-bordered focus:outline-none" v-model="username" />
                <div class="label">
                    <span class="label-text">{{ $t("client.auth.password") }}</span>
                </div>
                <input type="password" class="input input-bordered focus:outline-none" v-model="password" />
                <button type="submit" class="btn btn-secondary btn-circle">
                    <span class="loading loading-spinner loading-md" v-if="isLoading"></span>
                    <span v-else> ok </span>
                </button>
            </div>
            <div role="alert" class="alert" :class="alerts" v-if="isAlert">
                <span>{{ message }}</span>
            </div>
        </form>
    </div>
</template>

<script setup>
import encryption from "s22y-utils";

const config = useRuntimeConfig();
const { t, locale, setLocale } = useI18n();

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const isAlert = ref(false);
const alerts = ref("");
const message = ref("");

const changeLanguage = (lang) => {
    setLocale(lang); // 切换语言
};

const handleTheme = () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
};

const handleSubmit = async () => {
    const ALERT_TYPE = {
        WARNING: "alert-warning",
        SUCCESS: "alert-success",
        ERROR: "alert-error",
    };
    const REDIRECT_DELAY = 2000;
    const CONTENT_TYPE = "application/json";

    // 统一提示方法
    const showAlert = (type, msg) => {
        isAlert.value = true;
        alerts.value = type;
        message.value = msg;
    };

    // 输入验证
    const validations = [
        { field: username.value, message: t("client.auth.none") + " username" },
        { field: password.value, message: t("client.auth.none") + " password" },
    ];

    for (const validation of validations) {
        if (!validation.field) {
            showAlert(ALERT_TYPE.WARNING, validation.message);
            return;
        }
    }

    try {
        isLoading.value = true;

        const hpassword = encryption.passwordHash(password.value, config.public.tokenKeyClient);

        const response = await $fetch("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": CONTENT_TYPE },
            body: JSON.stringify({
                username: username.value,
                password: hpassword,
            }),
        });

        // 登录成功处理
        const handleLoginSuccess = () => {
            showAlert(ALERT_TYPE.SUCCESS, t("client.auth.login"));
            localStorage.setItem("token", response.token);
            localStorage.setItem("uid", response.uid);
            setTimeout(() => navigateTo("/chat"), REDIRECT_DELAY);
        };

        handleLoginSuccess();
    } catch (error) {
        console.error(t("client.auth.error"), error);
        const errorMessage = error.response?._data?.message || t("client.auth.error1");
        showAlert(ALERT_TYPE.ERROR, errorMessage);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.auth {
    display: flex;
    flex-direction: column;
    align-items: center;

    .control {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        align-items: center;

        .icon {
            font-size: 1.4rem;
            margin-right: 12px;
        }
    }
    .form {
        width: 600px;
        margin-top: 32vh;
        display: flex;
        flex-direction: column;

        h1 {
            font-size: 2.4rem;
            font-weight: bold;
        }
        p {
            font-size: 1.1rem;
            font-weight: bold;
            opacity: 0.8;
        }
        .in {
            width: 260px;
            position: relative;

            .label {
                padding-bottom: 4px;
            }
            .input {
                width: 100%;
                height: 42px;
                transition: 0.2s;
                border: 1px solid #e5e7eb;
            }
            .input:focus {
                box-shadow: 0px 0px 4px 1px rgba($color: #000000, $alpha: 0.2);
            }
            .btn {
                margin-top: 18px;
                position: absolute;
                bottom: -3px;
                right: -60px;
                background-color: #1F2937;
                color: #ffffff;

                .icon {
                    font-size: 1.4rem;
                }
            }
        }
        .alert {
            width: 260px;
            margin-top: 12px;
        }
    }
}

@media (max-width: 900px) {
    .auth {
        .form {
            width: 90vw;
            margin-top: 20vh;

            .in {
                width: 84%;
            }
            .alert {
                width: 100%;
            }
        }
    }
}
</style>
