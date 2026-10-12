import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/$/, "")] : []),
];
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);
// Local in-memory map as fallback if Redis is down or unavailable
const localUserSocketMap = new Map();
export const redisClient = createClient({
    url: process.env.REDIS_URI || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();
Promise.all([redisClient.connect(), pubClient.connect(), subClient.connect()])
    .then(() => {
    console.log("Redis connected and Socket.IO adapter set");
    io.adapter(createAdapter(pubClient, subClient));
})
    .catch((err) => {
    console.warn("Redis connection warning (falling back to memory):", err.message);
});
export const getReceiverSocketId = async (userId) => {
    try {
        if (redisClient.isOpen) {
            const socketId = await redisClient.hGet("userSocketMap", userId);
            if (socketId)
                return socketId;
        }
    }
    catch (err) {
        console.error("Redis hGet error:", err);
    }
    return localUserSocketMap.get(userId);
};
const broadcastOnlineUsers = async () => {
    try {
        const users = {};
        localUserSocketMap.forEach((socketId, uId) => {
            users[uId] = socketId;
        });
        if (redisClient.isOpen) {
            try {
                const redisUsers = await redisClient.hGetAll("userSocketMap");
                Object.assign(users, redisUsers);
            }
            catch (err) {
                console.error("Redis hGetAll error:", err);
            }
        }
        io.emit("getOnlineUsers", users);
    }
    catch (err) {
        console.error("Error broadcasting online users", err);
    }
};
io.on("connection", async (socket) => {
    const userId = socket.userId;
    const connectedUser = socket.user?.fullName;
    console.log("Connected user: ", connectedUser);
    if (userId) {
        localUserSocketMap.set(userId, socket.id);
        if (redisClient.isOpen) {
            try {
                await redisClient.hSet("userSocketMap", userId, socket.id);
            }
            catch (err) {
                console.error("Redis hSet error:", err);
            }
        }
    }
    // sends message to all the connected users
    await broadcastOnlineUsers();
    // with socket.on we are listening foe events from the frontend
    socket.on("disconnect", async () => {
        console.log("A user disconnected: ", socket.user?.fullName);
        if (userId) {
            localUserSocketMap.delete(userId);
            if (redisClient.isOpen) {
                try {
                    await redisClient.hDel("userSocketMap", userId);
                }
                catch (err) {
                    console.error("Redis hDel error:", err);
                }
            }
            await broadcastOnlineUsers();
        }
    });
});
export { server, app, io };
//# sourceMappingURL=socket.js.map