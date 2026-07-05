import express from "express";
import { getAllChatPartners, getAllContacts, getMessagesByUserId, sendMessage, } from "../controllers/message.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();
// first the requests will get rate limited and protected against all sorts of attacks and bots and only then will it gor for authentication, this is faster because unnecessary requests are blocked and then only valid ones are checked
router.use(arcjetProtection, protectRoute);
router.get("/contacts", getAllContacts);
router.get("/chats", getAllChatPartners); //keep the id below everything because since it is dynamic, it will match with the chat word in the endpoint
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);
export default router;
//# sourceMappingURL=message.routes.js.map