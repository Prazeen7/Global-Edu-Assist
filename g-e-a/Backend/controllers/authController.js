const AdminModel = require("../models/admin")
const UserModel = require("../models/user")
const Jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/emailService")

// Load environment variables
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    })
}

// User Login logic
const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await UserModel.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "Please sign up first" })
        }

        // Compare hashed password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password is incorrect" })
        }

        // Check if user is verified (OTP verified)
        if (!existingUser.isVerified) {
            // Generate new OTP if none exists or it's expired
            if (!existingUser.otp || existingUser.otpExpiry < new Date()) {
                const otp = generateOTP()
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

                existingUser.otp = otp
                existingUser.otpExpiry = otpExpiry
                await existingUser.save()

                await sendVerificationEmail(email, otp)
            }

            return res.status(401).json({
                message: "Email not verified",
                requiresVerification: true,
                email: email,
            })
        }

        // If user is verified, generate JWT token
        const token = Jwt.sign(
            { userId: existingUser._id, name: existingUser.firstName, user: existingUser.user || "user" },
            JWT_SECRET,
            { expiresIn: "1h" },
        )

        res.json({
            message: "Success",
            auth: token,
            firstName: existingUser.firstName,
            user: existingUser.user || "user",
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Admin Login logic
const adminLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const admin = await AdminModel.findOne({ email })
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Compare hashed password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Generate JWT token for admin with superAdmin flag
        const token = Jwt.sign(
            {
                userId: admin._id,
                name: admin.firstName,
                user: "admin",
                superAdmin: admin.superAdmin || false, // Include superAdmin status
            },
            JWT_SECRET,
            { expiresIn: "1h" },
        )

        // Log the token payload for debugging
        console.log("Admin login token payload:", {
            userId: admin._id,
            name: admin.firstName,
            user: "admin",
            superAdmin: admin.superAdmin || false,
        })

        res.json({
            message: "Success",
            auth: token, // Your system might use "auth" instead of "token"
            firstName: admin.firstName,
            user: "admin",
            superAdmin: admin.superAdmin || false, // Return superAdmin status
        })
    } catch (err) {
        console.error("Admin login error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

// Verify token and return user data
const verifyToken = (req, res) => {
    try {
        // The user object is already attached to req by the authMiddleware
        const { userId, user, superAdmin } = req.user

        // Find the user in the database to get the most up-to-date information
        if (user === "admin") {
            // For admin users, fetch from AdminModel
            AdminModel.findById(userId)
                .select("-password") // Exclude password
                .then((adminData) => {
                    if (!adminData) {
                        return res.status(404).json({ success: false, message: "Admin not found" })
                    }

                    // Return the admin data including superAdmin status
                    return res.status(200).json({
                        success: true,
                        message: "Token is valid",
                        user: {
                            userId: adminData._id,
                            firstName: adminData.firstName,
                            lastName: adminData.lastName,
                            email: adminData.email,
                            user: "admin",
                            superAdmin: adminData.superAdmin || false,
                        },
                    })
                })
                .catch((err) => {
                    console.error("Error fetching admin data:", err)
                    return res.status(500).json({ success: false, message: "Error fetching user data" })
                })
        } else {
            // For regular users, fetch from UserModel
            UserModel.findById(userId)
                .select("-password") // Exclude password
                .then((userData) => {
                    if (!userData) {
                        return res.status(404).json({ success: false, message: "User not found" })
                    }

                    // Return the user data
                    return res.status(200).json({
                        success: true,
                        message: "Token is valid",
                        user: {
                            userId: userData._id,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            user: "user",
                        },
                    })
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err)
                    return res.status(500).json({ success: false, message: "Error fetching user data" })
                })
        }
    } catch (err) {
        console.error("Token verification error:", err)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

// Forgot password - Send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        // Check if the email belongs to an admin
        const admin = await AdminModel.findOne({ email })
        if (admin) {
            return res.status(400).json({
                message: "Admin password reset not allowed through this portal",
            })
        }

        // Proceed with user lookup
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email not found" })
        }

        // Generate OTP and set expiration (10 minutes from now)
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()

        // Send OTP via email
        await sendPasswordResetEmail(email, otp)

        res.status(200).json({
            message: "OTP sent to your email",
            email: email,
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Verify OTP (used for both verification and password reset)
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid request" })
        }

        // Check if OTP matches and isn't expired
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        // OTP is valid - mark it as used
        user.otp = null
        user.otpExpiry = null

        // Only mark as verified if this is for account verification
        if (!user.isVerified) {
            user.isVerified = true
        }

        await user.save()

        // Generate JWT token
        const token = Jwt.sign({ userId: user._id, user: user.user || "user" }, JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
            message: "OTP verified successfully",
            auth: token,
            firstName: user.firstName,
            user: user.user || "user",
            email: email,
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Reset password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid request" })
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: "Password reset successfully" })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = {
    login,
    adminLogin,
    forgotPassword,
    verifyOTP,
    resetPassword,
    verifyToken,
}
