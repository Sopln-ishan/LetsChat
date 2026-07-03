import jwt from "jsonwebtoken";
import { jwtKey } from "./ENV.js";
export const generateToken = (userId, res) => {
    try {
        const secretKey = jwtKey();
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
    }
    catch (error) {
        console.error("Error in generate token lib: ", error);
    }
};
//# sourceMappingURL=utils.js.map