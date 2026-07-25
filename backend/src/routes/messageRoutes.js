import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteMessages, getMessages, getSharedMedia, markMessagesSeen, sendMessage } from "../controllers/messageController.js";
import upload from "../middleware/multer.js";


const router = express.Router();

router.post("/send/:receiverId", authMiddleware, upload.single("image"), sendMessage);
router.get("/shared-media/:userId", authMiddleware, getSharedMedia);
router.get("/:userId", authMiddleware, getMessages);
router.put("/seen/:userId", authMiddleware, markMessagesSeen);
router.delete("/:messageId", authMiddleware, deleteMessages);


export default router;