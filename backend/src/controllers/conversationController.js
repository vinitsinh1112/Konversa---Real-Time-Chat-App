import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import conversationModel from "../models/conversationModel.js";


export const getConversations = asyncHandler(async (req, res) => {
    const myId = req.user._id;

    const conversations = await conversationModel
        .find({ participants: myId, hiddenFor: { $ne: myId } })
        .populate("participants", "fullName email profilePic")
        .sort({ lastMessageTime: -1 });

    const formattedConvesations = conversations.map((conversation) => {

        const otherUser = conversation.participants.find((participant) => participant._id.toString() !== myId.toString());

        const myUnread = conversation.unreadCounts.find((item) => item.userId.toString() === myId.toString());

        return {
            _id: conversation._id,
            user: otherUser,
            lastMessage: conversation.lastMessage,
            lastMessageTime: conversation.lastMessageTime,
            unreadCount: myUnread ? myUnread.count : 0,
        }

    });

    res.status(httpStatus.OK).json({
        success: true,
        conversations: formattedConvesations
    });

});


export const deleteConversationForMe = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const myId = req.user._id;

    const conversation = await conversationModel.findOne({
        participants: {
            $all: [userId, myId],
        }
    });

    if (!conversation) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Conversation not found"
        });
    }

    conversation.hiddenFor.addToSet(myId);

    await conversation.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Conversation deleted successfully"
    });

});


export const unhideConversation = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const myId = req.user._id;

    const conversation = await conversationModel.findOne({
        participants: {
            $all: [myId, userId]
        }
    });

    if (!conversation) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Conversation not found"
        });
    }

    conversation.hiddenFor = conversation.hiddenFor.filter((id) => id.toString() !== myId.toString());

    await conversation.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Conversation restored"
    });

});