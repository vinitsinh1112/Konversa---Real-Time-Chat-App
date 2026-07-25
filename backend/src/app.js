import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import conversationRoutes from "./routes/conversationRoutes.js"

const app = express();


// middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());



// routes
app.get("/", (req, res) => { res.send("API Running"); });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);








export default app;
