const express = require("express");
const router = express.Router();
const { registerUser, getAllUsers } = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);

// Get all users
router.get("/users", getAllUsers);

module.exports = router;