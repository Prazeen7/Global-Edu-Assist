const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        text: `Your verification OTP is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your verification OTP is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};