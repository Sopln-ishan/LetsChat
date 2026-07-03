import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { cloudinaryConfig } from "../lib/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }
        const normalizedFullName = fullName.trim();
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
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName: normalizedFullName,
            email: normalizedEmail,
            password: hashedPassword,
        });
        if (newUser) {
            const savedUser = await newUser.save();
            if (savedUser) {
                sendWelcomeEmail({
                    receiverName: newUser.fullName,
                    recieverEmail: newUser.email,
                    clientURL: "localhost:3000",
                });
            }
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
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(existingUser._id, res);
        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.fullName,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
        });
    }
    catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successful" });
};
export const updateUser = async (req, res) => {
    const { profilePic } = req.body;
    if (!profilePic) {
        return res
            .status(400)
            .json({ message: "No profile pic found, setting to default image" });
    }
    try {
        const userId = req.user?._id;
        cloudinaryConfig();
        const uploadResult = await cloudinary.uploader.upload(profilePic);
        const user = User.findByIdAndUpdate(userId, { profilePic: uploadResult.secure_url }, { new: true }).select("-password");
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error in updateUser controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=auth.controllers.js.map