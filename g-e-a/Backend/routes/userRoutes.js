const express = require("express");
const router = express.Router();
const {
    registerUser,
    getAllUsers,
    verifyUserEmail,
    resendVerificationOTP
} = require("../controllers/userController");

// Register a new user
router.post("/registerUser", registerUser);

// Verify user email with OTP
router.post("/verify-email", verifyUserEmail);

// Resend verification OTP
router.post("/resend-otp", resendVerificationOTP);

// Get all users
router.get("/users", getAllUsers);

module.exports = router;