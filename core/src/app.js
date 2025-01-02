import cors from "cors";
import "dotenv/config";
import express from "express";
const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由设置
import chatRouter from "./routers/chatRouter.js";
app.use("/chat", chatRouter);
import userRouter from "./routers/userRouter.js";
app.use("/user", userRouter);

export default app;
