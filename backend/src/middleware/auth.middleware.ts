import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtKey } from "../lib/ENV.js";
import User from "../models/User.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwtSecretKey: string = jwtKey();

    const token: string = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload & {
      userId: string;
    };
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware in protect route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
