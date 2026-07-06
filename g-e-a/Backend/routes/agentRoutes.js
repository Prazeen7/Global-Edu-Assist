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
const cloudinary = require("../config/cloudinary")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// Configure Cloudinary storage for agent uploads
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "global-edu-assist/agents",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "jfif"],
        transformation: [{ width: 1500, height: 1500, crop: "limit" }],
    },
})

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".jfif"]
    
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'))
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true)
    } else {
        console.log(`Rejected file: ${file.originalname}, MIME: ${file.mimetype}`)
        cb(new Error(`Invalid file type. Only JPEG/PNG/WEBP images allowed. Got: ${file.mimetype}`), false)
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

// Password reset routes
router.post("/api/agent/forgot-password", forgotPassword)
router.post("/api/agent/verify-otp", verifyOTP)
router.post("/api/agent/reset-password", resetPassword)

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
