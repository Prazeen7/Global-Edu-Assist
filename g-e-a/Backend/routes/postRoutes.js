const express = require("express")
const router = express.Router()
const path = require("path")
const {
    createPost,
    getAllPosts,
    getPostsByAgentId,
    getCurrentAgentPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    checkLikeStatus,
} = require("../controllers/postController")
const { handleUploadErrors } = require("../config/multerConfig")
const verifyToken = require("../middleware/authMiddleware")

// Wrap route handlers with try-catch for better error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

// Public routes
router.get("/", asyncHandler(getAllPosts))
router.get("/my-posts", verifyToken, asyncHandler(getCurrentAgentPosts))
router.get("/agent/:agentId", asyncHandler(getPostsByAgentId))
router.get("/:id", asyncHandler(getPostById))

// Protected routes (require authentication)
router.post("/", verifyToken, asyncHandler(createPost))
router.put("/:id", verifyToken, asyncHandler(updatePost))
router.delete("/:id", verifyToken, asyncHandler(deletePost))

// Like routes
router.post("/:id/like", verifyToken, asyncHandler(likePost))
router.get("/:id/like-status", verifyToken, asyncHandler(checkLikeStatus))

// Error handling middleware for uploads
router.use(handleUploadErrors)

module.exports = router
