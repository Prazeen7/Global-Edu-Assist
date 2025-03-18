const UserModel = require("../models/user");
const nodemailer = require("nodemailer");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/generatePassword");

// Load environment variables
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Login logic
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Please sign up first" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        Jwt.sign({ userId: existingUser._id }, JWT_SECRET, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong" });
            }
            res.json({
                message: "Success",
                firstName: existingUser.firstName,
                user: existingUser.user,
                auth: token,
            });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Forgot password logic
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        const newPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your New Password",
            text: `Your new password is: ${newPassword}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Failed to send email" });
            }
            res.status(200).json({ message: "Email sent successfully" });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { login, forgotPassword };