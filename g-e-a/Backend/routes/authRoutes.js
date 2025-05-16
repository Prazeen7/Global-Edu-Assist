const express = require("express")
const router = express.Router()
const {
    login,
    adminLogin,
    forgotPassword,
    verifyOTP,
    resetPassword,
    verifyToken,
} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/login", login)
router.post("/admin-login", adminLogin)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)

// Use the verifyToken controller function for the verify-token endpoint
router.get("/verify-token", authMiddleware, verifyToken)

module.exports = router
