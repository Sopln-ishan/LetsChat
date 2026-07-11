import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./lib/db.js";
import { app, server } from "./lib/socket.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(express.json({ limit: "10mb" })); // This will help us access the fields that the user will send through the forms
app.use(cookieParser()); // This will allow us to access the cookies from the response section
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use("/api/auth/", authRoutes);
app.use("/api/messages/", messageRoutes);
server.listen(PORT, () => {
    connectDB();
    console.log(`server started on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map