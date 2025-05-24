const AgentModel = require("../models/agents")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const emailService = require("../services/emailService")

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: "Email is required" })
        }

        const agent = await AgentModel.findOne({ email })

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        const otp = generateOTP()
        const otpExpiry = new Date()
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10)

        agent.otp = otp
        agent.otpExpiry = otpExpiry
        await agent.save()

        await emailService.sendPasswordResetEmail(email, otp)

        res.status(200).json({
            success: true,
            message: "Password reset OTP has been sent to your email",
        })
    } catch (error) {
        console.error("Forgot password error:", error)
        res.status(500).json({
            error: "Server error. Please try again later.",
        })
    }
}

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" })
        }

        const agent = await AgentModel.findOne({ email })

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        if (agent.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" })
        }

        if (!agent.otpExpiry || new Date() > new Date(agent.otpExpiry)) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." })
        }

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        })
    } catch (error) {
        console.error("Verify OTP error:", error)
        res.status(500).json({
            error: "Server error. Please try again later.",
        })
    }
}

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required" })
        }

        const agent = await AgentModel.findOne({ email }).select("+password +status")

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        if (agent.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" })
        }

        if (!agent.otpExpiry || new Date() > new Date(agent.otpExpiry)) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        agent.password = hashedPassword
        agent.otp = undefined
        agent.otpExpiry = undefined
        // Preserve the existing status (e.g., "approved") instead of resetting to "pending"
        await agent.save()

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        })
    } catch (error) {
        console.error("Reset password error:", error)
        res.status(500).json({
            error: "Server error. Please try again later.",
        })
    }
}