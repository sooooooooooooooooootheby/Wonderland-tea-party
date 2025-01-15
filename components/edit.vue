<template>
    <div :style="{width: edit.isOpen ? '100%' : '0'}" class="edit">
        <div class="header">
            <div class="left">
                <div class="icons" @click="edit.isOpen = !edit.isOpen">
                    <Icon class="icon" name="mynaui:x-solid"/>
                </div>
                <span class="title">Editor</span>
            </div>
            <div class="right">
            </div>
        </div>
        <div class="body">
            <MonacoEditor style="height: 100%" v-model="edit.input"/>
        </div>
    </div>
</template>

<script setup>
const edit = useEditStore();
</script>

<style scoped lang="scss">
.edit {
    height: 100vh;
    border-left: 1px solid #DFDFDF;
    transition: .2s;
    overflow: hidden;

    .header {
        width: 100%;
        height: 64px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;

            .title {
                margin-left: 24px;
                font-size: 1.1rem;
                font-weight: bold;
            }
        }
    }

    .body {
        width: 100%;
        height: calc(100% - 64px);
    }
}
</style>