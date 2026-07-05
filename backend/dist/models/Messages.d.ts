import mongoose from "mongoose";
interface IMessage {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    text?: string;
    image?: string;
}
export declare const Messages: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export {};
//# sourceMappingURL=Messages.d.ts.map