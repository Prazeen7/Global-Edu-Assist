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
} = require("../controllers/agentController")
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
        cb(null, "profilePicture-" + uniqueSuffix + ext)
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
const uploadProfilePicture = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).single("profilePicture")

// Public routes
router.post("/createAgent", createAgent)
router.post("/agent/login", loginAgent)
router.get("/getAgent", getAllAgents)
router.get("/agent/:id", getAgentById)
router.get("/availAgent", availAgent)

// Admin protected routes
router.put(
    "/agent/:id/status", // Updated to include /agent prefix
    updateAgentStatus,
)
router.delete(
    "/agent/:id", // Updated to include /agent prefix
    deleteAgent,
)

// Update agent profile with profile picture upload
router.put("/agent/:id/update", uploadProfilePicture, updateAgentProfile)

// Error handling middleware for uploads
router.use(handleUploadErrors)

module.exports = router
