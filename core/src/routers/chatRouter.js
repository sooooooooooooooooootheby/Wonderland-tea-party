import express from "express";
const chatRouter = express.Router();

import chatConnection from "../controllers/chatConnection.js";
import verifyToken from "../middleware/token.js"

chatRouter.post("/stream-chat", verifyToken, chatConnection.streamSignleChat);
chatRouter.post("/multiwheelChat", verifyToken, chatConnection.multiwheelChat);

chatRouter.get("/queryMessagesList", verifyToken, chatConnection.queryMessagesList);
chatRouter.get("/queryMessageRecord", verifyToken, chatConnection.queryChat);

export default chatRouter;