import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],

    lastMessage: {
        type: String,
        default: "",
    },

    lastMessageTime: {
        type: Date,
        default: null,
    },

    unreadCounts: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            count: {
                type: Number,
                default: 0,
            },
        },
    ],

    hiddenFor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

}, { timestamps: true });


const conversationModel = mongoose.model("Conversation", conversationSchema);


export default conversationModel;