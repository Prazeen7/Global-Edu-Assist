const UserModel = require("../models/user")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const { sendVerificationEmail } = require("../services/emailService")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")

// Load environment variables
require("dotenv").config()
const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS) || 10
const JWT_SECRET = process.env.JWT_SECRET_Admin
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/

// Generate JWT token for user
const generateUserToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        user: user.user || "user", 
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Generate JWT token for admin
const generateAdminToken = (admin) => {
    const payload = {
        userId: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        user: "admin", 
        role: "admin", 
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    })
}

// Validate password strength
const validatePassword = (password) => {
    if (!PASSWORD_REGEX.test(password)) {
        return {
            isValid: false,
            message:
                "Password must be at least 8 characters long, contain at least one uppercase letter and one special character (!@#$%^&*)",
        }
    }
    return { isValid: true }
}

// Register a new user with OTP verification
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, user = "user" } = req.body

    try {
        // Validate password strength
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message,
            })
        }

        // Check if the email is already taken
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered",
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        // Generate OTP and set expiration 
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        // Create user with verification fields
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            user,
            otp,
            otpExpiry,
            isVerified: false,
        })

        // Send verification email
        await sendVerificationEmail(email, otp)

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification OTP.",
            data: {
                userId: newUser._id,
                email: newUser.email,
            },
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: err.message,
        })
    }
}

// Verify User Email with OTP
const verifyUserEmail = async (req, res) => {
    const { email, otp } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            })
        }

        // Check if OTP matches and isn't expired
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            })
        }

        // Mark user as verified and clear OTP fields
        user.isVerified = true
        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: {
                email: user.email,
                isVerified: user.isVerified,
            },
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Verification failed",
            error: err.message,
        })
    }
}

// Resend Verification OTP
const resendVerificationOTP = async (req, res) => {
    const { email } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            })
        }

        // Generate new OTP and set expiration
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()

        // Send new verification email
        await sendVerificationEmail(email, otp)

        res.status(200).json({
            success: true,
            message: "New verification OTP sent to your email",
            data: {
                email: user.email,
            },
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
            error: err.message,
        })
    }
}

// Fetch all users from the database
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).select("-password -otp -otpExpiry")
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: err.message,
        })
    }
}

// Fetch user profile
const getProfile = async (req, res) => {
    try {
        // Log the request user info for debugging
        console.log("User in request:", req.user)

        const userId = req.user.userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token",
            })
        }

        const user = await UserModel.findById(userId).select("-password -otp -otpExpiry")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        let profilePictureUrl = null
        if (user.profilePicture) {
            profilePictureUrl = `${req.protocol}://${req.get("host")}/Uploads/${user.profilePicture}`
        }

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                contactNumber: user.contactNumber,
                profilePicture: profilePictureUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                user: user.user || "user", 
            },
        })
    } catch (error) {
        console.error("Error in getProfile:", error)
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, contactNumber } = req.body;

        console.log("Update profile request:", {
            userId,
            body: req.body,
            file: req.file ? req.file.filename : 'No file uploaded'
        });

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.contactNumber = contactNumber || user.contactNumber;

        if (req.file) {
            // If there's an existing profile picture, delete it
            if (user.profilePicture) {
                try {
                    const oldImagePath = path.join(__dirname, "../uploads", user.profilePicture.split('/').pop());
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log(`Deleted old profile picture: ${oldImagePath}`);
                    }
                } catch (error) {
                    console.error("Error deleting old profile picture:", error);
                    // Continue with the update even if file deletion fails
                }
            }
            
            // Save the new profile picture path
            user.profilePicture = req.file.filename;
            console.log(`Saved new profile picture: ${req.file.filename}`);
        }

        await user.save();

        const profilePictureUrl = user.profilePicture
            ? `${req.protocol}://${req.get("host")}/uploads/${user.profilePicture}`
            : null;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                contactNumber: user.contactNumber,
                profilePicture: profilePictureUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                user: user.user || "user",
            },
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Update user password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId
        const { currentPassword, newPassword } = req.body

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            })
        }

        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message,
            })
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS)
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

// Verify token endpoint 
const verifyToken = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Token is valid",
        user: {
            userId: req.user.userId,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            user: req.user.user || "user",
        },
    })
}

module.exports = {
    registerUser,
    verifyUserEmail,
    resendVerificationOTP,
    getAllUsers,
    getProfile,
    updateProfile,
    updatePassword,
    verifyToken,
    generateUserToken,
    generateAdminToken, 
}
