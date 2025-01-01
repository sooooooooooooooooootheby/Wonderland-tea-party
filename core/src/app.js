import cors from "cors";
import "dotenv/config";
import express from "express";
const app = express();

const corsConfig = {
    origin: "",
};

app.use(cors(corsConfig));
app.use(express.json()); // JSON 请求体解析
app.use(express.urlencoded({ extended: true })); // URL 编码请求体解析

// 路由设置
import chatRouter from "./routers/chatRouter.js";
app.use("/chat", chatRouter);
import userRouter from "./routers/userRouter.js";
app.use("/user", userRouter);

export default app;
