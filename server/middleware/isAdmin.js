import { jwtDecode } from "jwt-decode";

export default defineEventHandler(async (event) => {
    if (!event._path.includes("/api/admin")) {
        return;
    }

    const token = event.req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        throw createError({
            statusCode: 401,
            message: "Token 不存在",
        });
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "admin") {
        throw createError({
            statusCode: 403,
            message: "不是 admin, 无法操作",
        });
    }
});
