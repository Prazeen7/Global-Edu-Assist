const express = require("express")
const router = express.Router()
const chatController = require("../controllers/chatController")

// Get all chat users for a specific user
router.get("/users/:userId", chatController.getChatUsers)

// Get messages between two users
router.get("/messages/:senderId/:receiverId", chatController.getMessages)

// Send a message
router.post("/send", chatController.sendMessage)

module.exports = router
