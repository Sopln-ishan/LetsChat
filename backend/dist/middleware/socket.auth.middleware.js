import { jwtKey } from "../lib/ENV.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const socketAuthMiddleware = async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        let token;
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
        const decoded = jwt.verify(token, jwtKey());
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
    }
    catch (error) {
        console.error("Error in socket auth middleware: ", error);
        next(new Error("Unauthorized - internal server error"));
    }
};
//# sourceMappingURL=socket.auth.middleware.js.map