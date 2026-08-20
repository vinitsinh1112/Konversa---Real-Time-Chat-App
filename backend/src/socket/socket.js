import { Server } from 'socket.io';
import http from "http";
import app from '../app.js';


export const userSocketMap = {}

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});


io.on("connection", (socket) => {




    const userId = socket.handshake.query.userId;


    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverId) {
            io.to(receiverSocketId).emit("userTyping");
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverId) {
            io.to(receiverSocketId).emit("userStopTyping");
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });

});

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

export { io, server };