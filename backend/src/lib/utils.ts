import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

export const generateToken = (userId: Types.ObjectId, res: Response) => {
  const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
  if (secretKey) {
    const token = jwt.sign({ userId }, secretKey, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks: cross-site scripting
      sameSite: "strict", //CSRF attacks
      secure: process.env.NODE_ENV === "development" ? false : true,
    });

    return token;
  } else {
    throw new Error("Error in jwt key");
    return res.status(500).json({ message: "Internal server error" });
  }
};
