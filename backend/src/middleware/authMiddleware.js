import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized - No token provided",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message,
        });
    }
});