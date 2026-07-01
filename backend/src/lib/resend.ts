import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resendAPI: string | undefined = process.env.RESEND_API_KEY;
const senderEmail: string | undefined = process.env.EMAIL_FROM;
const senderName: string | undefined = process.env.EMAIL_FROM_NAME;

export const resendClient = new Resend(resendAPI ? resendAPI : "");

export const sender = {
  email: senderEmail ? senderEmail : "",
  name: senderName ? senderName : "",
};
