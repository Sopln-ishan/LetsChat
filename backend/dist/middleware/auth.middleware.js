import jwt from "jsonwebtoken";
import { jwtKey } from "../lib/ENV.js";
import User from "../models/User.js";
export const protectRoute = async (req, res, next) => {
    try {
        const jwtSecretKey = jwtKey();
        const token = req.cookies.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - no token provided" });
        }
        const decoded = jwt.verify(token, jwtSecretKey);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in auth middleware in protect route: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=auth.middleware.js.map