const express = require("express")
const router = express.Router()
const {
    registerUser,
    verifyUserEmail,
    resendVerificationOTP,
    getAllUsers,
    getProfile,
    updateProfile,
    updatePassword,
    verifyToken,
} = require("../controllers/userController")
const { uploadSingle } = require("../config/multerConfig")
const authenticateJWT = require("../middleware/authMiddleware")
const authMiddleware = require("../middleware/authMiddleware")

// Public routes
router.post("/registerUser", registerUser)
router.post("/verify-email", verifyUserEmail)
router.post("/resend-otp", resendVerificationOTP)

// Protected routes
router.get("/users", authenticateJWT, getAllUsers)
router.get("/auth/profile", authenticateJWT, getProfile)
// Use uploadSingle middleware here with the field name "image"
router.put("/auth/profile", authenticateJWT, uploadSingle, updateProfile)
router.put("/auth/password", authenticateJWT, updatePassword)
router.get("/auth/verify-token", authenticateJWT, verifyToken)

// User-specific routes
router.get("/user/profile", authenticateJWT.isUser, getProfile)
router.put("/user/profile", authenticateJWT.isUser, uploadSingle, updateProfile)
router.put("/user/password", authenticateJWT.isUser, updatePassword)

// Use the verifyToken controller function for the verify-token endpoint
router.get("/verify-token", authMiddleware, verifyToken)

module.exports = router