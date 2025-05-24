const jwt = require("jsonwebtoken")
require("dotenv").config()
const Admin = require("../models/admin")
const User = require("../models/user")

const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET_Agent = process.env.JWT_SECRET_Agent

// Main middleware function that verifies tokens
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" })
    }

    try {
        // First try to verify as a user token
        try {
            const decoded = jwt.verify(token, JWT_SECRET)

            let userExists = false

            if (decoded.user === "admin") {
                const admin = await Admin.findById(decoded.userId)
                userExists = !!admin
            } else {
                const user = await User.findById(decoded.userId)
                userExists = !!user
            }

            if (!userExists) {
                return res.status(401).json({
                    success: false,
                    message: "User no longer exists"
                })
            }

            req.user = decoded
            req.userType = decoded.user || "user" 
            next()
        } catch (userTokenError) {
            // If user token verification fails, try as agent token
            try {
                const decoded = jwt.verify(token, JWT_SECRET_Agent)
                req.user = decoded 
                req.agent = decoded 
                req.userType = decoded.user || "agent" 
                next()
            } catch (agentTokenError) {
                // Both verifications failed
                throw new Error("Invalid token")
            }
        }
    } catch (error) {
        console.error("Token verification error:", error.message)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        })
    }
}

verifyToken.isAgent = (req, res, next) => {
    console.log("Checking if user is agent. User type:", req.userType)
    if (req.userType !== "agent") {
        return res.status(403).json({ message: "Agent access required" })
    }
    next()
}

verifyToken.isUser = (req, res, next) => {
    console.log("Checking if user is regular user. User type:", req.userType, "User ID:", req.user?.userId)

    if (req.originalUrl.includes("/api/progress/")) {
        return next()
    }

    // For other routes, maintain the strict check
    if (req.userType !== "user") {
        return res.status(403).json({ message: "User access required" })
    }
    next()
}

verifyToken.isAdmin = (req, res, next) => {
    console.log("Checking if user is admin. User type:", req.userType, "Role:", req.user?.role)
    if (req.userType !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
    }
    next()
}

verifyToken.isSuperAdmin = (req, res, next) => {
    console.log("Checking if user is super admin. User type:", req.userType, "SuperAdmin:", req.user?.superAdmin)
    if (req.userType !== "admin" || !req.user.superAdmin) {
        return res.status(403).json({ message: "Super Admin access required" })
    }
    next()
}

module.exports = verifyToken