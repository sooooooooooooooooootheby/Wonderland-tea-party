<template>
    <div class="login">
        <div class="left">
            <video src="~/assets/login.mp4" autoplay loop muted playsinline></video>
            <div class="greetings">
                <span>{{ greetings.at }}</span>
                <span>{{ greetings.getNeko }}</span>
            </div>
        </div>
        <div class="right">
            <div class="rightBox">
                <div class="icon">😺</div>
                <span class="title">Welcome back~</span>
                <a-form
                    class="form"
                    :model="formState"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @submit="user.login(formState.username, formState.password)"
                >
                    <a-input class="input" v-model:value="formState.username" placeholder="username" />

                    <a-input-password class="input" v-model:value="formState.password" placeholder="password" />

                    <a-button class="input" type="primary" html-type="submit">NEXT</a-button>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
const user = useUserStore();
const greetings = useGreetingsStore();

const formState = reactive({
    username: "",
    password: "",
});

onMounted(() => {
    greetings.handleGreetings();
});
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100vh;
    display: flex;

    .left {
        width: 50vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;

        video {
            position: absolute;
            z-index: -1;
        }
        .greetings {
            width: 25vw;
            margin-top: -256px;
            margin-left: -256px;
            font-size: 2rem;
            font-weight: bold;
            color: #2d333a;
        }
    }
    .right {
        width: 50vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;

        .rightBox {
            width: 38vw;

            .icon {
                font-size: 4rem;
                margin-top: 256px;
            }

            .title {
                font-size: 2rem;
                font-weight: bold;
                color: #2d333a;
                margin-bottom: 12px;
            }

            .form {
                width: 300px;
                margin-top: 12px;
                display: flex;
                flex-direction: column;
            }
        }
    }
}
.input {
    margin: 8px 0;
}
</style>
