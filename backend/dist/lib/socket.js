import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});
// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);
const userSocketMap = {};
export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
io.on("connection", (socket) => {
    const userId = socket.userId;
    const connectedUser = socket.user?.fullName;
    console.log("Connected user: ", connectedUser);
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    // sends message to all the connected users
    io.emit("getOnlineUsers", userSocketMap);
    // with socket.on we are listening foe events from the frontend
    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.user.fullName);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", userSocketMap);
        }
    });
});
export { server, app, io };
//# sourceMappingURL=socket.js.map