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

        // Find agent by email
        const agent = await AgentModel.findOne({ email })

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        // Generate OTP
        const otp = generateOTP()
        const otpExpiry = new Date()
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

        // Save OTP to agent document
        agent.otp = otp
        agent.otpExpiry = otpExpiry
        await agent.save()

        // Send OTP via email
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

        // Find agent by email
        const agent = await AgentModel.findOne({ email })

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        // Check if OTP matches and is not expired
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

        // Find agent by email
        const agent = await AgentModel.findOne({ email })

        if (!agent) {
            return res.status(404).json({ error: "No agent found with this email address" })
        }

        // Verify OTP again for security
        if (agent.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" })
        }

        if (!agent.otpExpiry || new Date() > new Date(agent.otpExpiry)) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." })
        }

        // Password validation
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" })
        }

        // Hash the new password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        // Update password and clear OTP fields
        agent.password = hashedPassword
        agent.otp = undefined
        agent.otpExpiry = undefined
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
