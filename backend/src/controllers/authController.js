import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import bcrypt from "bcryptjs"
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";


export const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "All fields are required"
        });

    }

    // check user exsits
    const userExists = await userModel.findOne({ email });

    if (userExists) {
        return res.status(httpStatus.CONFLICT).json({
            success: false,
            message: "User already exists"
        });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    });

    // generate token
    generateToken(user._id, res);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Login Successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic
        }
    });
});


export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "All fields are required"
        });
    }

    // check user exists
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
            sucess: false,
            message: "User not found"
        });
    }

    // match password
    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Invalid Credentials"
        });
    }

    // generate token
    generateToken(user._id, res);

    res.status(httpStatus.OK).json({
        message: "Login successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio
        }
    });

});


export const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(httpStatus.OK).json({
        success: true,
        message: "Logged out successfully"
    });

});


export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(httpStatus.OK).json({
        success: true,
        user: req.user,
    });
});

