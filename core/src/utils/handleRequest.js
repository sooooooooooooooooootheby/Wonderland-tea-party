import logger from "./logger.js";

export const handleDBQueryError = (err, res) => {
    logger.error(err);
    res.status(500).json({ code: 0, message: "服务器错误" });
};