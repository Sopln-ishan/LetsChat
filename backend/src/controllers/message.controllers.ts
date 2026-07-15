import type { Request, Response } from "express";
import { Messages } from "../models/Messages.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

cloudinaryConfig();

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const loggedInUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    res.status(200).json(loggedInUsers);
  } catch (error) {
    console.error("Error in getting all contacts: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllChatPartners = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;
    const messages = await Messages.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) => {
          return msg.senderId.toString() === loggedInUserId?.toString()
            ? msg.receiverId
            : msg.senderId;
        }),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getting all chat partners: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id: chatPartnerId } = req.params;
  const cursor = req.query.cursor as string;

  if (!userId) {
    console.error("No userId found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const query: any = {
      $or: [
        { senderId: userId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: userId },
      ],
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const theirChats = await Messages.find(query).sort({ _id: -1 }).limit(30);

    return res.status(200).json(theirChats.reverse());
  } catch (error) {
    console.error("Error in getting messages between users: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
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
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //todo: send message in real-time if user is online using socket.io
    const receiverSocketId = getReceiverSocketId(receiverId as string);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sending message: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
