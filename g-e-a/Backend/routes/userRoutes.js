const express = require("express")
const router = express.Router()
const {
    registerUser,
    loginUser,
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

// Public routes
router.post("/registerUser", registerUser)
router.post("/login", loginUser)
router.post("/verify-email", verifyUserEmail)
router.post("/resend-otp", resendVerificationOTP)

// Protected routes
router.get("/users", authenticateJWT, getAllUsers)
router.get("/auth/profile", authenticateJWT, getProfile)
router.put("/auth/profile", authenticateJWT, uploadSingle, updateProfile)
router.put("/auth/password", authenticateJWT, updatePassword)
router.get("/auth/verify-token", authenticateJWT, verifyToken)

// User-specific routes
router.get("/user/profile", authenticateJWT.isUser, getProfile)
router.put("/user/profile", authenticateJWT.isUser, uploadSingle, updateProfile)
router.put("/user/password", authenticateJWT.isUser, updatePassword)

module.exports = router
