import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import messageModel from "../models/messageModel.js";
import { io, getReceiverSocketId } from "../socket/socket.js"
import conversationModel from "../models/conversationModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


export const sendMessage = asyncHandler(async (req, res) => {

    const { text } = req.body;
    const image = req.file;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if ((!text || !text.trim()) && !image) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Message text is required"
        });
    }

    let imageUrl = "";

    if (image) {
        const result = await uploadToCloudinary(image.buffer);

        imageUrl = result.secure_url;
    }

    let conversation = await conversationModel.findOne({
        participants: {
            $all: [senderId, receiverId]
        }
    });

    if (!conversation) {
        conversation = await conversationModel.create({
            participants: [senderId, receiverId],
        });
    }

    conversation.lastMessage = text?.trim() || "🖼️ Photo";
    conversation.lastMessageTime = new Date();

    const receiverUnread = conversation.unreadCounts.find((item) => item.userId.toString() === receiverId.toString());

    if (receiverUnread) {
        receiverUnread.count += 1;
    } else {
        conversation.unreadCounts.push({
            userId: receiverId,
            count: 1,
        });
    }

    await conversation.save();


    const message = await messageModel.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {

        io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Message sent successfully",
        data: message
    });

});


export const getMessages = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel.find({
        $or: [
            {
                senderId: myId,
                receiverId: userId,
            },
            {
                senderId: userId,
                receiverId: myId,
            },
        ],
    }).sort({ createdAt: 1 });

    res.status(httpStatus.OK).json({
        success: true,
        messages
    });

});


export const markMessagesSeen = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const myId = req.user._id;

    const unreadMessages = await messageModel.find({
        senderId: userId,
        receiverId: myId,
        seen: false,
    });

    const messageIds = unreadMessages.map((message) => message._id);

    await messageModel.updateMany(
        {
            _id: { $in: messageIds }
        },
        {
            seen: true
        }
    );

    const conversation = await conversationModel.findOne({
        participants: {
            $all: [myId, userId]
        }
    });

    const myUnread = conversation.unreadCounts.find((item) => item.userId.toString() === myId.toString());

    if (myUnread) {
        myUnread.count = 0;
    }

    await conversation.save();

    const senderSocketId = getReceiverSocketId(userId);

    if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", messageIds);
    }

    res.status(httpStatus.OK).json({
        success: true,
    });

});


export const getSharedMedia = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const myId = req.user._id;

    const images = await messageModel.find({
        $or: [
            {
                senderId: myId,
                receiverId: userId
            },
            {
                senderId: userId,
                receiverId: myId,
            }
        ],
        image: { $ne: "" }
    })
        .select("image createdAt")
        .sort({ createdAt: -1 });

    res.status(httpStatus.OK).json({
        success: true,
        images
    });

});


export const deleteMessages = asyncHandler(async (req, res) => {

    const { messageId } = req.params;
    const myId = req.user._id;

    const message = await messageModel.findById(messageId);

    if (!message) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Message not found"
        });
    }

    if (message.senderId.toString() !== myId.toString()) {
        return res.status(httpStatus.FORBIDDEN).json({
            success: false,
            message: "You can only delete your own messages"
        });
    }

    await messageModel.findByIdAndDelete(messageId);


    const senderId = message.senderId;
    const receiverId = message.receiverId;

    const conversation = await conversationModel.findOne({
        participants: {
            $all: [senderId, receiverId]
        }
    });

    if (conversation) {
        const latestMessage = await messageModel.findOne({
            $or: [
                {
                    senderId,
                    receiverId,
                },
                {
                    senderId: receiverId,
                    receiverId: senderId,
                }
            ]
        }).sort({ createdAt: -1 });

        if (latestMessage) {
            conversation.lastMessage = latestMessage.text || "🖼️ Photo";

            conversation.lastMessageTime = latestMessage.createdAt;

        } else {
            conversation.lastMessage = "";
            conversation.lastMessageTime = null;
        }

        await conversation.save();

    }

    const senderSocketId = getReceiverSocketId(senderId.toString());
    const receiverSocketId = getReceiverSocketId(receiverId.toString());

    const payload = {
        deletedMessageId: messageId,
        lastMessage: conversation?.lastMessage || "",
        lastMessageTime: conversation?.lastMessageTime || null,
    }

    if (senderSocketId) {
        io.to(senderSocketId).emit("messageDeleted", payload);
    }

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", payload);
    }


    res.status(httpStatus.OK).json({
        success: true,
        message: "Message deleted successfully",
        messageId,
        lastMessage: conversation?.lastMessage || "",
        lastMessageTime: conversation?.lastMessageTime || null,
    });

});