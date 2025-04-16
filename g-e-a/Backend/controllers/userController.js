const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { sendVerificationEmail } = require("../services/emailService");

// Load environment variables
require("dotenv").config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
};

// Validate password strength
const validatePassword = (password) => {
    if (!PASSWORD_REGEX.test(password)) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long, contain at least one uppercase letter and one special character (!@#$%^&*)"
        };
    }
    return { isValid: true };
};

// Register a new user with OTP verification
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, user = "u" } = req.body;

    try {
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: passwordValidation.message
            });
        }

        // Check if the email is already taken
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email is already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Generate OTP and set expiration (10 minutes from now)
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Create user with verification fields
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            user,
            otp,
            otpExpiry,
            isVerified: false
        });

        // Send verification email
        await sendVerificationEmail(email, otp);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification OTP.",
            data: {
                userId: newUser._id,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Registration failed",
            details: err.message
        });
    }
};

// Verify User Email with OTP
const verifyUserEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: "Email already verified"
            });
        }

        // Check if OTP matches and isn't expired
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired OTP"
            });
        }

        // Mark user as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: {
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Verification failed",
            details: err.message
        });
    }
};

// Resend Verification OTP
const resendVerificationOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: "Email already verified"
            });
        }

        // Generate new OTP and set expiration
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send new verification email
        await sendVerificationEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "New verification OTP sent to your email",
            data: {
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Failed to resend OTP",
            details: err.message
        });
    }
};

// Fetch all users from the database
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch users",
            details: err.message
        });
    }
};

module.exports = {
    registerUser,
    verifyUserEmail,
    resendVerificationOTP,
    getAllUsers
};