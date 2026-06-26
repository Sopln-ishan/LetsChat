import express from "express";
import { messages } from "../controllers/message.controllers.js";
const router = express.Router();
router.get("/", messages);
export default router;
//# sourceMappingURL=message.routes.js.map