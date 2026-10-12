import { jwtKey } from "../lib/ENV.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";

// Extend Socket.IO's Socket interface to include a `user` property
declare module "socket.io" {
  interface Socket {
    user?: any;
    userId?: string;
  }
}

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    let token: string | undefined;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((row) => row.trim());
      const jwtCookie = cookies.find((row) => row.startsWith("jwt="));
      if (jwtCookie) {
        token = jwtCookie.split("=")[1];
      }
    }

    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      console.error("Socket connection rejected: No token provided in cookie or auth");
      return next(new Error("Unauthorized - No token provided"));
    }

    const decoded = jwt.verify(token, jwtKey()) as unknown as jwt.JwtPayload;
    if (!decoded) {
      console.log("Socket connection rejected - Invalid token");
      return next(new Error("Unauthorized - Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected - User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    next();
  } catch (error) {
    console.error("Error in socket auth middleware: ", error);
    next(new Error("Unauthorized - internal server error"));
  }
};
