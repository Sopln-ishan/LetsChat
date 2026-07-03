import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import type { Express } from "express";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./lib/db.js";

dotenv.config();

const app: Express = express();
const PORT: string | 3000 = process.env.PORT || 3000;

app.use(express.json()); // This will help us access the fields that the user will send through the forms
app.use(cookieParser()); // This will allow us to access the cookies from the response section

app.use("/api/auth/", authRoutes);
app.use("/api/messages/", messageRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server started on http://localhost:${PORT}`);
});
