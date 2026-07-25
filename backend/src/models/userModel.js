import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter valid email"],
    },

    password: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,
        default: "",
    },

    bio: {
        type: String,
        default: "Hey there, I am using Konversa",
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;