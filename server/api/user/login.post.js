import userDB from "~/server/database/user.js";
import jwt from "jsonwebtoken";
import b64_hmac_sha256 from '~/utils/sha256.js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    const t = await useTranslation(event)

    if (!username || !password) {
        throw createError({
            statusCode: 404,
            message: t("server.user.login.none"),
        });
    }

    const config = useRuntimeConfig();
    let saltPassword = b64_hmac_sha256(config.tokenKeyServer, password);

    try {
        const results = await userDB.login(username, saltPassword);

        if (results.length === 0) {
            setResponseStatus(event, 401);
            return { message: t("server.user.login.error") };
        }

        if (results[0].state === "stop") {
            setResponseStatus(event, 403);
            return { message: t("server.user.login.stop") };
        }

        const token = jwt.sign(
            { name: results[0].name, id: results[0].id, role: results[0].role },
            config.tokenKeyServer,
            { expiresIn: config.tokenOutTime }
        );

        return {
            message: t("server.user.login.login"),
            uid: results[0].id,
            token: token,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: t("server.server") + error.message,
        });
    }
});