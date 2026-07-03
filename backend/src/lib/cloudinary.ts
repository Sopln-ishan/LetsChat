import { v2 as cloudinary } from "cloudinary";
import { cloudinaryKeys } from "./ENV.js";

export const cloudinaryConfig = () => {
  try {
    cloudinary.config({
      cloud_name: cloudinaryKeys().cloudName,
      api_key: cloudinaryKeys().cloudApiKey,
      api_secret: cloudinaryKeys().cloudApiSecret,
    });
  } catch (error) {
    console.error("Error in cloudinary", error);
    throw new Error("error in cloudinaryConfig lib");
  }
};
