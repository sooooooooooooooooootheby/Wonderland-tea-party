<template>
    <div class="user">
        <h1>用户设置</h1>
        <a-table :dataSource="userList" :columns="columns" bordered>
            <template #bodyCell="{ column, text, record }">
                <template v-if="['username', 'password', 'role', 'state', 'comment'].includes(column.dataIndex)">
                    <div>
                        <div v-if="editableData[record.id]">
                            <a-input
                                v-model:value="editableData[record.id][column.dataIndex]"
                                style="margin: -5px 0"
                                v-if="['username', 'password', 'comment'].includes(column.dataIndex)"
                            />
                            <a-select
                                v-model:value="editableData[record.id][column.dataIndex]"
                                :options="role"
                                v-if="['role'].includes(column.dataIndex)"
                            ></a-select>
                            <a-select
                                v-model:value="editableData[record.id][column.dataIndex]"
                                :options="state"
                                v-if="['state'].includes(column.dataIndex)"
                            ></a-select>
                        </div>
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                        <span v-if="editableData[record.id]">
                            <div v-if="record.id !== 0">
                                <a-typography-link @click="save(record.id)" style="margin-right: 8px"> 保存 </a-typography-link>
                                <a-popconfirm title="取消编辑?" @confirm="cancel(record.id)">
                                    <a>取消</a>
                                </a-popconfirm>
                            </div>
                            <div v-else>
                                <a-typography-link @click="addUser(record.id)" style="margin-right: 8px">
                                    添加
                                </a-typography-link>
                                <a-typography-link @click="cancel(record.id)"> 取消 </a-typography-link>
                            </div>
                        </span>
                        <span v-else>
                            <a style="margin-right: 8px" @click="edit(record.id)">编辑</a>
                            <a-popconfirm title="删除此账户?" @confirm="del(record.id)">
                                <a style="color: red">删除</a>
                            </a-popconfirm>
                        </span>
                    </div>
                </template>
            </template>
            <template #title>用户列表</template>
            <template #footer>
                <a-button type="primary" @click="add">添加用户</a-button>
            </template>
        </a-table>
        <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" header="用户相关提示">
                <ol style="margin-left: 12px">
                    <li>因为 id 是由数据库自动生成的, 所以当你添加用户时出现 id 为 0 是正常情况.</li>
                    <li>
                        密码是由特定函数和盐反复加密生成的, 会在前端加密一次, 后端加密一次,
                        所以当你在修改密码时请使用下面的加密工具加密后再填入. (加密工具会自动加密两次, 所以直接填入加密密码即可)
                    </li>
                    <li>
                        身份组目前只有 admin(管理员) 和 guest(游客) 两种身份, guest 是无法进入设置页面的, 包括入口也会被隐藏.
                    </li>
                    <li>状态目前只有 active(活跃) 和 stop(暂停) 两种状态, 设置为 stop 无法使用任何功能, 包括登录.</li>
                </ol>
            </a-collapse-panel>
        </a-collapse>
        <div class="set">
            <div class="left">
                <div class="sundry">
                    <h2>杂项</h2>
                    <div class="block">
                        <span>允许用户自行注册</span>
                        <a-switch
                            v-model:checked="setting.user.isRegister"
                            @click="setting.putSetting('isRegister', setting.user.isRegister)"
                        />
                    </div>
                </div>
            </div>
            <div class="right">
                <a-card size="small" title="密码加密工具" style="width: 300px">
                    <a-input v-model:value="password" placeholder="原始密码" />
                    <a-input v-model:value="key" placeholder="key" style="margin: 12px 0" />
                    <a-button type="primary" @click="handlePassword(password, key)">转换</a-button>
                    <div class="out">
                        <a-input v-model:value="hashPassword" placeholder="转换结果" />
                        <a-button type="primary" class="copy" @click="copyPassword">
                            <Icon name="mynaui:clipboard-solid" />
                        </a-button>
                    </div>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import encryption from "s22y-utils";

const setting = useSettingStore();

const columns = [
    {
        title: "id",
        name: "id",
        dataIndex: "id",
        key: "id",
        width: "2%",
    },
    {
        title: "username",
        name: "username",
        dataIndex: "username",
        key: "username",
        width: "10%",
    },
    {
        title: "password",
        name: "password",
        dataIndex: "password",
        key: "password",
        width: "15%",
    },
    {
        title: "身份组",
        name: "role",
        dataIndex: "role",
        key: "role",
        width: "10%",
    },
    {
        title: "状态",
        name: "state",
        dataIndex: "state",
        key: "state",
        width: "10%",
    },
    {
        title: "备注",
        name: "comment",
        dataIndex: "comment",
        key: "comment",
    },
    {
        title: "操作",
        name: "operation",
        dataIndex: "operation",
        key: "operation",
        width: "8%",
    },
];
const userList = ref([]);

const role = ref([
    {
        value: "admin",
        label: "admin",
    },
    {
        value: "guest",
        label: "guest",
    },
]);
const state = ref([
    {
        value: "active",
        label: "active",
    },
    {
        value: "stop",
        label: "stop",
    },
]);

const activeKey = ref([]);

const password = ref("");
const key = ref("");
const hashPassword = ref("");

const handlePassword = (pa, key) => {
    const p = encryption.passwordHash(pa, key);
    hashPassword.value = encryption.passwordHash(p, key);
};

const copyPassword = async () => {
    try {
        await navigator.clipboard.writeText(hashPassword.value);
        message.success("复制成功喵");
    } catch (error) {
        console.log(error);
        message.error("复制失败喵" + error);
    }
};

const getUserList = async () => {
    try {
        const response = await $fetch("/api/admin/getUserList", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        userList.value = response.results;
    } catch (error) {
        console.error(error);
        message.error(error.response._data.message);
    }
};

const editableData = reactive({});
const edit = (id) => {
    editableData[id] = cloneDeep(userList.value.filter((item) => id === item.id)[0]);
};
const save = async (id) => {
    Object.assign(userList.value.filter((item) => id === item.id)[0], editableData[id]);
    const { username, password, role, state, comment } = editableData[id];

    try {
        const response = await $fetch("/api/admin/putUser", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                id,
                username,
                password,
                role,
                state,
                comment,
            }),
        });

        message.success("保存成功");
        delete editableData[id];
    } catch (error) {
        console.error(error);
        message.error(error.response._data.message);
    }
};
const del = async (id) => {
    try {
        const response = await $fetch("/api/admin/delUser", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                id,
            }),
        });

        userList.value = userList.value.filter((item) => item.id !== id);
        message.success("删除成功");
    } catch (error) {
        console.error(error);
        message.error(error.response._data.message);
    }
};
const add = () => {
    userList.value.push({ id: 0 });
    edit(0);
};
const addUser = async (id) => {
    console.log(editableData[id].username);
    try {
        const response = await $fetch("/api/admin/addUser", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                username: editableData[id].username,
                password: editableData[id].password,
                role: editableData[id].role,
                state: editableData[id].state,
                comment: editableData[id].comment,
            }),
        });

        message.success("添加成功");
        getUserList();
    } catch (error) {
        console.error(error);
        message.error(error.response._data.message);
    }
};
const cancel = (id) => {
    if (id === 0) {
        return (userList.value = userList.value.filter((item) => item.id !== 0));
    }
    delete editableData[id];
};

onMounted(() => {
    getUserList();
});
</script>

<style lang="scss" scoped>
.user {
    padding: 0 64px;

    h1 {
        margin-bottom: 12px;
    }
}
.out {
    margin-top: 12px;
    display: flex;
    align-items: center;

    .copy {
        margin-left: 12px;
    }
}
.set {
    display: flex;
    margin-top: 24px;

    .left {
        width: 100%;
        border-right: 1px solid #d9d9d9;

        .block {
            margin: 6px 0;
            display: flex;
            align-items: center;

            span {
                margin-right: 8px;
                font-size: 14px;
            }
        }
    }
    .right {
        width: 300px;
        margin-left: 12px;
    }
}
</style>
