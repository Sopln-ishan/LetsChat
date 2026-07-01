import dotenv from "dotenv";
import { Resend } from "resend";
dotenv.config();
const resendAPI = process.env.RESEND_API_KEY;
const senderEmail = process.env.EMAIL_FROM;
const senderName = process.env.EMAIL_FROM_NAME;
export const resendClient = new Resend(resendAPI ? resendAPI : "");
export const sender = {
    email: senderEmail ? senderEmail : "",
    name: senderName ? senderName : "",
};
//# sourceMappingURL=resend.js.map