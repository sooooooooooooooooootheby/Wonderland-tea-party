import express from "express";
const userRouter = express.Router();

import userConnection from "../controllers/userConnection.js";

userRouter.post("/login", userConnection.login);

export default userRouter;