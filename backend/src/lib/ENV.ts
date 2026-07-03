import dotenv from "dotenv";

dotenv.config();

export const jwtKey = () => {
  const jwtSecretKey: string | undefined = process.env.JWT_SECRET_KEY;

  if (!jwtSecretKey) {
    throw new Error("jwt key undefined");
  }

  return jwtSecretKey;
};

export const cloudinaryKeys = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudEnvVar = process.env.CLOUDINARY_API_ENV_VAR;

  if (!cloudName || !cloudApiKey || !cloudApiSecret || !cloudEnvVar) {
    throw new Error("cloudinary variables undefined");
  }

  return { cloudName, cloudApiKey, cloudApiSecret, cloudEnvVar };
};
