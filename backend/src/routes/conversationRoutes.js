import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteConversationForMe, getConversations, unhideConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.delete("/:userId", authMiddleware, deleteConversationForMe);
router.put("/unhide/:userId", authMiddleware, unhideConversation);

export default router;
