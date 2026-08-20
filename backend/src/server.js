import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 4001;

// DB Connection
connectDB();

// Start Server
server.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
});