import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

type SenderData = {
  receiverName: string;
  recieverEmail: string;
  clientURL: string;
};

export const sendWelcomeEmail = async ({
  receiverName,
  recieverEmail,
  clientURL,
}: SenderData) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: ["23ishansekhar10d@gmail.com"],
    subject: "Hello World!",
    html: createWelcomeEmailTemplate(receiverName, clientURL),
  });

  if (error) {
    console.error("Error in sending email ", error);
    throw new Error("Failed to send email");
  } else {
    console.log({ data });
  }
};
