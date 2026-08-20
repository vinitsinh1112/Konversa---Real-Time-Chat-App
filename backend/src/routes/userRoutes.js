import express from "express";
import { getUsers, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.put("/profile", authMiddleware, upload.single("profilePic"), updateProfile);
router.get("/", authMiddleware, getUsers);

export default router;