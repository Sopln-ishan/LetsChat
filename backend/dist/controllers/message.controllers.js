import { Messages } from "../models/Messages.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
export const getAllContacts = async (req, res) => {
    try {
        const userId = req.user?._id;
        const loggedInUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        res.status(200).json(loggedInUsers);
    }
    catch (error) {
        console.error("Error in getting all contacts: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getAllChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id;
        const messages = await Messages.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });
        const chatPartnersIds = [
            ...new Set(messages.map((msg) => {
                return msg.senderId.toString() === loggedInUserId?.toString()
                    ? msg.receiverId
                    : msg.senderId;
            })),
        ];
        const chatPartners = await User.find({
            _id: { $in: chatPartnersIds },
        }).select("-password");
        res.status(200).json(chatPartners);
    }
    catch (error) {
        console.error("Error in getting all chat partners: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getMessagesByUserId = async (req, res) => {
    const userId = req.user?._id;
    const { id: chatPartnerId } = req.params;
    if (!userId) {
        console.error("No userId found");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const theirChats = await Messages.find({
            $or: [
                { senderId: userId, receiverId: chatPartnerId },
                { senderId: chatPartnerId, receiverId: userId },
            ],
        });
        return res.status(200).json(theirChats);
    }
    catch (error) {
        console.error("Error in getting messages between users: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;
        if (!text && !image) {
            return res
                .status(400)
                .json({ message: "Atleast a text or an image is required" });
        }
        if (senderId == receiverId) {
            return res
                .status(400)
                .json({ message: "Cannot send messages to yourself" });
        }
        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        let imageUrl = "";
        if (image) {
            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;
        }
        const newMessage = new Messages({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl,
        });
        //todo: send message in real-time if user is online using socket.io
        await newMessage.save();
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sending message: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=message.controllers.js.map