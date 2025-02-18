import modelDB from "~/server/database/model.js";

const createModel = async (event, display, model, icon, info, state) => {
    const t = await useTranslation(event);

    try {
        const results = await modelDB.addModel(display, model, icon, info, state);
        const message = results.affectedRows;;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
};

const updateModel = async (event, id, display, model, icon, info, state) => {
    const t = await useTranslation(event);

    if (!id) {
        throw createError({
            statusCode: 404,
            message: t("server.admin.user&model.user&model.InvalidId"),
        });
    }

    try {
        const results = await modelDB.putModel(id, display, model, icon, info, state);
        const message = results.message;
        return { message };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.error") + error,
        });
    }
};

const deleteModel = async (event, id) => {
    const t = await useTranslation(event);

    if (!id) {
        throw createError({
            statusCode: 404,
            message: t("server.admin.user&model.user&model.InvalidId"),
        });
    }

    try {
        const results = await modelDB.delModel(id);
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
    const { id, display, model, icon, info, state } = body;
    const t = await useTranslation(event);

    let results;

    switch (action) {
        case "create":
            results = createModel(event, display, model, icon, info, state);
            break;
        case "update":
            results = updateModel(event, id, display, model, icon, info, state);
            break;
        case "delete":
            results = deleteModel(event, id);
            break;
        default:
            throw createError({
                statusCode: 404,
                message: t("server.admin.user.user.InvalidAction"),
            });
    }

    return results;
});
