import mongoose from "mongoose";

interface IMessage {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  image?: string;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Messages = mongoose.model<IMessage>("Messages", messageSchema);
