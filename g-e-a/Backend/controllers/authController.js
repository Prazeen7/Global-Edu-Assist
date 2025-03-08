const UserModel = require("../models/user");
const nodemailer = require("nodemailer");
const Jwt = require("jsonwebtoken");
const JWT_SECRET = "GEA_Login@User";
const generatePassword = require("../utils/generatePassword");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "np03cs4a220278@heraldcollege.edu.np",
        pass: "mkak rsmp stzl fyme",
    },
});

// Login logic
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.json({ message: "Please sign up first" });
        }
        if (existingUser.password !== password) {
            return res.json({ message: "Password is incorrect" });
        }
        if (existingUser) {
            Jwt.sign({ existingUser }, JWT_SECRET, (err, token) => {
                if (err) {
                    return res.json({ message: "Something went wrong" });
                }
                res.json({
                    message: "Success",
                    firstName: existingUser.firstName,
                    user: existingUser.user,
                    auth: token,
                });
            });
        }
    } catch (err) {
        res.status(400).json(err);
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
        user.password = newPassword;
        await user.save();

        const mailOptions = {
            from: "np03cs4a220278@heraldcollege.edu.np",
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
};

module.exports = { login, forgotPassword };