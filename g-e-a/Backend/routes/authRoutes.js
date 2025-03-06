const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const nodemailer = require("nodemailer");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password",
    },
});

// Function to generate a random password
const generatePassword = () => {
    const length = 8;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.json({ message: "Please sign up first" });
        }
        if (existingUser.password !== password) {
            return res.json({ message: "Password is incorrect" });
        }
        res.json({ message: "Success", firstName: existingUser.firstName, user: existingUser.user });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Forgot password endpoint
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        const newPassword = generatePassword();
        user.password = newPassword;
        await user.save();

        const mailOptions = {
            from: "your-email@gmail.com",
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
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
