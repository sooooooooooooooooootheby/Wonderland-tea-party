import userDB from "~/server/database/user.js";

const createUser = async (event, username, password, role, state, comment) => {
    const t = await useTranslation(event);
    try {
        const results = await userDB.addUser(username, password, role, state, comment);
        const message = results.affectedRows;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
};

const updateUser = async (event, id, username, password, role, comment) => {
    const t = await useTranslation(event);
    if (!id) {
        throw createError({
            statusCode: 404,
            message: t("server.admin.user&model.user&model.InvalidId"),
        });
    }

    try {
        const results = await userDB.putUser(id, username, password, role, state, comment);
        const message = results.message;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
};

const deleteUser = async (event, id) => {
    const t = await useTranslation(event);
    if (!id) {
        throw createError({
            statusCode: 404,
            message: t("server.admin.user&model.user&model.InvalidId"),
        });
    }

    try {
        const results = await userDB.delUser(id);
        const message = results.affectedRows;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { action } = body;
    const { id, username, password, role, state, comment } = body;
    const t = await useTranslation(event);

    let results;

    switch (action) {
        case "create":
            results = createUser(event, username, password, role, state, comment);
            break;
        case "update":
            results = updateUser(event, id, username, password, role, comment);
            break;
        case "delete":
            results = deleteUser(event, id);
            break;
        default:
            throw createError({
                statusCode: 404,
                message: t("server.admin.user&model.user&model.InvalidAction"),
            });
    }

    return results;
});
