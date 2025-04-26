const jwt = require("jsonwebtoken")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET_Agent = process.env.JWT_SECRET_Agent

// Main middleware function that verifies tokens
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    try {
        // First try to verify as a user token
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            req.user = decoded
            req.userType = decoded.user || "user" // Ensure userType is set from token or default to "user"
            console.log("Token verified as user token:", req.userType)
            next()
        } catch (userTokenError) {
            // If user token verification fails, try as agent token
            try {
                const decoded = jwt.verify(token, JWT_SECRET_Agent)
                req.user = decoded // Store in req.user for consistency
                req.agent = decoded // Also keep in req.agent for backward compatibility
                req.userType = decoded.user || "agent" // Ensure userType is set from token or default to "agent"
                console.log("Token verified as agent token:", req.userType)
                next()
            } catch (agentTokenError) {
                // Both verifications failed
                throw new Error("Invalid token")
            }
        }
    } catch (error) {
        console.error("Token verification error:", error.message)
        return res.status(401).json({ message: "Invalid or expired token", error: error.message })
    }
}

// Helper middleware to check if the request is from an agent
verifyToken.isAgent = (req, res, next) => {
    console.log("Checking if user is agent. User type:", req.userType)
    if (req.userType !== "agent") {
        return res.status(403).json({ message: "Agent access required" })
    }
    next()
}

// Helper middleware to check if the request is from a user
verifyToken.isUser = (req, res, next) => {
    // Log the userType for debugging
    console.log("Checking if user is regular user. User type:", req.userType, "User ID:", req.user?.userId)

    // For progress routes, we need to be more flexible
    // Allow both regular users and agents to access progress routes
    if (req.originalUrl.includes("/api/progress/")) {
        return next()
    }

    // For other routes, maintain the strict check
    if (req.userType !== "user") {
        return res.status(403).json({ message: "User access required" })
    }
    next()
}

// Helper middleware to check if the request is from an admin
verifyToken.isAdmin = (req, res, next) => {
    console.log("Checking if user is admin. User type:", req.userType, "Role:", req.user?.role)
    if (req.userType !== "user" || !req.user.role || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
    }
    next()
}

// Export the main middleware function for backward compatibility
module.exports = verifyToken
