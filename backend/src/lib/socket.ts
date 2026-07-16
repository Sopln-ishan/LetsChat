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

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

export const redisClient = createClient({ url: process.env.REDIS_URI || "redis://localhost:6379" });
redisClient.on("error", (err) => console.error("Redis Client Error", err));

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

Promise.all([redisClient.connect(), pubClient.connect(), subClient.connect()]).then(() => {
  console.log("Redis connected and Socket.IO adapter set");
  io.adapter(createAdapter(pubClient, subClient));
}).catch((err) => {
  console.error("Redis connection error:", err);
});

export const getReceiverSocketId = async (userId: string) => {
  return await redisClient.hGet("userSocketMap", userId);
};

const broadcastOnlineUsers = async () => {
  try {
    const users = await redisClient.hGetAll("userSocketMap");
    io.emit("getOnlineUsers", users);
  } catch (err) {
    console.error("Error broadcasting online users", err);
  }
};

io.on("connection", async (socket) => {
  const userId = socket.userId;
  const connectedUser = socket.user?.fullName;
  console.log("Connected user: ", connectedUser);

  if (userId) {
    await redisClient.hSet("userSocketMap", userId, socket.id);
  }

  // sends message to all the connected users
  await broadcastOnlineUsers();

  // with socket.on we are listening foe events from the frontend
  socket.on("disconnect", async () => {
    console.log("A user disconnected: ", socket.user?.fullName);

    if (userId) {
      await redisClient.hDel("userSocketMap", userId);
      await broadcastOnlineUsers();
    }
  });
});

export { server, app, io };
