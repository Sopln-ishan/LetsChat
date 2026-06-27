import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }
        const name = fullName.trim();
        const normalizedEmail = email.trim().toLowerCase();
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be atleast 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ fullName, email, password: hashedPassword });
        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in sign up function ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = (req, res) => {
    res.send("You are in login page");
};
export const logout = (req, res) => {
    res.send("You are in logout page");
};
//# sourceMappingURL=auth.controllers.js.map