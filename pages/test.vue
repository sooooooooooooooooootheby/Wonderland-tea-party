<template>
    <div class="test">
        <div class="btn" onclick="del.showModal()">
            <Icon class="icon" name="mynaui:trash-two-solid" />
        </div>
        <dialog id="del" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="text-lg font-bold">{{ $t("client.sider.out.title") }}</h3>
                <p class="py-4">{{ $t("client.sider.out.p") }}</p>
                <div class="bar">
                    <form method="dialog">
                        <button class="btn">{{ $t("client.sider.out.button1") }}</button>
                    </form>
                </div>
            </div>
        </dialog>
        <div class="btn" onclick="logout.showModal()">
            <Icon class="icon" name="mynaui:trash-two-solid" />
        </div>
        <dialog id="logout" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="text-lg font-bold">{{ $t("client.sider.out.title") }}</h3>
                <p class="py-4">{{ $t("client.sider.out.p") }}</p>
                <div class="bar">
                    <form method="dialog">
                        <button class="btn">{{ $t("client.sider.out.button1") }}</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.test {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
