const express = require("express");
const router = express.Router();
const { login, adminLogin, forgotPassword, verifyOTP, resetPassword} = require("../controllers/authController");
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;