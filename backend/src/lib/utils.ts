import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { jwtKey } from "./ENV.js";

export const generateToken = (userId: Types.ObjectId, res: Response) => {
  try {
    const secretKey: string = jwtKey();

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
  } catch (error) {
    console.error("Error in generate token lib: ", error);
  }
};
