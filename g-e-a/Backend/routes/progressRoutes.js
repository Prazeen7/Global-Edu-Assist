const express = require("express")
const router = express.Router()
const {
    initializeProgress,
    getProgress,
    updateStageProgress,
    resetProgress,
    completeProgress,
    deselectAllStageItems,
} = require("../controllers/progressController")
const verifyToken = require("../middleware/authMiddleware")

// Protected routes (require authentication)
router.post("/initialize", verifyToken, initializeProgress)
router.get("/:userId", verifyToken, getProgress)
router.put("/:userId/update", verifyToken, updateStageProgress)
router.post("/:userId/reset", verifyToken, resetProgress)
router.post("/:userId/complete", verifyToken, completeProgress)
router.post("/:userId/deselect/:stage", verifyToken, deselectAllStageItems)

module.exports = router
