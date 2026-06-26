import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./lib/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // This will help us access the fields that the user will send through the forms
app.use("/api/auth/", authRoutes);
app.use("/api/messages/", messageRoutes);
app.listen(PORT, () => {
    connectDB();
    console.log(`server started on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map