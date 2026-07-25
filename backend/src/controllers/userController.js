import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import userModel from "../models/userModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


export const updateProfile = asyncHandler(async (req, res) => {

    const { fullName, bio } = req.body;

    // Check user exists
    const user = await userModel.findById(req.user._id);

    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "User not found"
        });
    }

    // full name
    if (fullName) {
        user.fullName = fullName;
    }

    // bio
    if (bio) {
        user.bio = bio
    }

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        user.profilePic = result.secure_url;
    }

    await user.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Profile updated successfully",
        user
    });

});


export const getUsers = asyncHandler(async (req, res) => {

    const users = await userModel.find({ _id: { $ne: req.user._id }, }).select("-password");

    res.status(httpStatus.OK).json({
        success: true,
        count: users.length,
        users
    });

});