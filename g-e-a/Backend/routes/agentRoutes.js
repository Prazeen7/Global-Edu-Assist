const express = require("express")
const router = express.Router()
const {
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgentStatus,
    deleteAgent,
    loginAgent,
    availAgent,
    updateAgentProfile,
    updateAgentInfo,
    uploadProfilePicture,
    uploadDocument,
} = require("../controllers/agentController")
const { forgotPassword, verifyOTP, resetPassword } = require("../controllers/agentAuthController")
const { handleUploadErrors } = require("../config/multerConfig")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Set upload directory and create if it doesn't exist
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext)
    },
})

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const allowedExtensions = [".jpg", ".jpeg", ".png"]
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Invalid file type. Only JPEG/PNG/JPG allowed"), false)
    }
}

// Create upload middleware for profile picture
const profileUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).single("profilePicture")

// Create upload middleware for single document
const documentUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).single("document")

// Public routes
router.post("/createAgent", createAgent)
router.post("/agent/login", loginAgent)
router.get("/getAgent", getAllAgents)
router.get("/agent/:id", getAgentById)
router.get("/availAgent", availAgent)

// Make sure the route paths match what your frontend is expecting
// Update the password reset routes to include the correct prefix if needed:

// Password reset routes
router.post("/api/agent/forgot-password", forgotPassword)
router.post("/api/agent/verify-otp", verifyOTP)
router.post("/api/agent/reset-password", resetPassword)

// Or if your API is configured differently, adjust accordingly

// Admin protected routes
router.put("/agent/:id/status", updateAgentStatus)
router.delete("/agent/:id", deleteAgent)

// Update agent profile with text data only
router.put("/agent/:id/update-info", updateAgentInfo)

// New routes for separate file uploads
router.post(
    "/agent/:id/upload-profile",
    (req, res, next) => {
        profileUpload(req, res, (err) => {
            if (err) {
                console.error("Profile upload error:", err)
                return res.status(400).json({ error: err.message || "Profile upload failed" })
            }
            next()
        })
    },
    uploadProfilePicture,
)

router.post(
    "/agent/:id/upload-document",
    (req, res, next) => {
        documentUpload(req, res, (err) => {
            if (err) {
                console.error("Document upload error:", err)
                return res.status(400).json({ error: err.message || "Document upload failed" })
            }
            next()
        })
    },
    uploadDocument,
)

// Legacy route - keep for backward compatibility
router.put("/agent/:id/update", (req, res) => {
    res.status(400).json({
        error: "This endpoint is deprecated. Please use the separate endpoints for data and file uploads.",
        suggestedEndpoints: ["/agent/:id/update-info", "/agent/:id/upload-profile", "/agent/:id/upload-document"],
    })
})

// Error handling middleware for uploads
router.use(handleUploadErrors)

module.exports = router
