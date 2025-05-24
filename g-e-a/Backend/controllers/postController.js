const Post = require("../models/post")
const Like = require("../models/like")
const AgentModel = require ("../models/agents")

const path = require("path")
const fs = require("fs")
// Import the multer configuration
const { uploadSingle, handleUploadErrors } = require("../config/multerConfig")

const debug = require("debug")("app:postController")

// Create a new post
exports.createPost = async (req, res) => {
    try {
        uploadSingle(req, res, async (err) => {
            if (err) {
                return handleUploadErrors(err, req, res, () => {
                    res.status(400).json({ error: err.message })
                })
            }

            try {
                const { title, content, category } = req.body

                // Get agent ID from token
                const agentId = req.user?.id || req.user?._id || req.user?.userId || req.agent?.id

                if (!agentId) {
                    return res.status(401).json({ error: "Agent ID not found in token" })
                }

                // Prepare image data if uploaded
                let image = null
                if (req.file) {
                    image = {
                        url: `/uploads/${req.file.filename}`,
                        filename: req.file.filename,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                    }

                    console.log("Image saved with URL:", image.url)
                }

                // Create new post
                const newPost = new Post({
                    title,
                    content,
                    category,
                    agent: agentId,
                    image,
                    likes: 0, 
                })

                const savedPost = await newPost.save()
                res.status(201).json({
                    success: true,
                    message: "Post created successfully",
                    data: savedPost,
                })
            } catch (error) {
                if (req.file) {
                    fs.unlinkSync(req.file.path)
                }
                res.status(400).json({ error: error.message })
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

// get all posts
exports.getAllPosts = async (req, res) => {
    try {
        debug("Fetching all posts")
        const posts = await Post.find().sort({ createdAt: -1 })

        debug(`Found ${posts.length} posts`)
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        })
    } catch (error) {
        debug(`Error in getAllPosts: ${error.message}`)
        console.error("Full error in getAllPosts:", error)
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        })
    }
}

// Get posts by agent ID 
exports.getPostsByAgentId = async (req, res) => {
    try {
        const { agentId } = req.params

        const posts = await Post.find({ agent: agentId }).sort({ createdAt: -1 }).populate({
            path: "agent",
            select: "companyName profilePicture email contactNumber headOfficeAddress",
        })

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get posts by current agent (protected)
exports.getCurrentAgentPosts = async (req, res) => {
    try {
        // Get agent ID from token - handle both formats
        const agentId = req.user.id || req.user._id || req.user.userId || req.agent?.id

        if (!agentId) {
            return res.status(401).json({ error: "Agent ID not found in token" })
        }

        console.log("Fetching posts for agent ID:", agentId)

        const posts = await Post.find({ agent: agentId }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        })
    } catch (error) {
        console.error("Error in getCurrentAgentPosts:", error)
        res.status(500).json({ error: error.message })
    }
}

// Get single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id).populate({
            path: "agent",
            select: "companyName profilePicture email contactNumber headOfficeAddress",
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        res.status(200).json({
            success: true,
            data: post,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update post
exports.updatePost = async (req, res) => {
    try {
        uploadSingle(req, res, async (err) => {
            if (err) {
                return handleUploadErrors(err, req, res, () => {
                    res.status(400).json({ error: err.message })
                })
            }

            try {
                const { id } = req.params
                const { title, content, category } = req.body

                // Get agent ID from token
                const agentId = req.user.id || req.user._id || req.user.userId || req.agent?.id

                if (!agentId) {
                    return res.status(401).json({ error: "Agent ID not found in token" })
                }

                // Find post and verify ownership
                const post = await Post.findById(id)

                if (!post) {
                    return res.status(404).json({ error: "Post not found" })
                }

                if (post.agent.toString() !== agentId) {
                    return res.status(403).json({ error: "Not authorized to update this post" })
                }

                // Prepare update data
                const updateData = {
                    title,
                    content,
                    category,
                    updatedAt: new Date(),
                }

                // Handle image update 
                if (req.file) {
                    // Remove old image file if it exists
                    if (post.image && post.image.filename) {
                        try {
                            // Extract the file path from the URL
                            const oldFilePath = post.image.url.startsWith("/")
                                ? post.image.url.substring(1) 
                                : post.image.url

                            if (fs.existsSync(oldFilePath)) {
                                fs.unlinkSync(oldFilePath)
                            }
                        } catch (err) {
                            console.error("Error removing old image:", err)
                        
                        }
                    }

                    // Add new image with the correct path
                    updateData.image = {
                        url: `/uploads/${req.file.filename}`,
                        filename: req.file.filename,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                    }
                }

                // Update post
                const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true })

                res.status(200).json({
                    success: true,
                    message: "Post updated successfully",
                    data: updatedPost,
                })
            } catch (error) {
                // Clean up uploaded file if error occurs
                if (req.file) {
                    fs.unlinkSync(req.file.path)
                }
                res.status(400).json({ error: error.message })
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

// Delete post 
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params

        // Get agent ID from token 
        const agentId = req.user.id || req.user._id || req.user.userId || req.agent?.id

        if (!agentId) {
            return res.status(401).json({ error: "Agent ID not found in token" })
        }

        // Find post and verify ownership
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.agent.toString() !== agentId) {
            return res.status(403).json({ error: "Not authorized to delete this post" })
        }

        // Delete image file if it exists
        if (post.image && post.image.url) {
            try {
                // Extract the file path from the URL
                const filePath = post.image.url.startsWith("/")
                    ? post.image.url.substring(1) 
                    : post.image.url

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            } catch (err) {
                console.error("Error removing image file:", err)
                
            }
        }

        // Delete all likes associated with this post
        await Like.deleteMany({ post: id })

        // Delete post
        await Post.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Like post 
exports.likePost = async (req, res) => {
    try {
        const { id } = req.params

        // Get user ID from token
        const userId = req.user?.id || req.user?._id || req.user?.userId || req.agent?.id

        if (!userId) {
            return res.status(401).json({ error: "User ID not found in token" })
        }

        // Find post
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        // Check if user has already liked this post
        const existingLike = await Like.findOne({ post: id, user: userId })

        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: "You have already liked this post",
                data: {
                    likes: post.likes,
                },
            })
        }

        // Create a new like record
        const newLike = new Like({
            post: id,
            user: userId,
        })

        await newLike.save()

        // Increment likes count
        post.likes = (post.likes || 0) + 1
        await post.save()

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: {
                likes: post.likes,
            },
        })
    } catch (error) {
        console.error("Error liking post:", error)
        res.status(500).json({ error: error.message })
    }
}

// Check if user has liked a post
exports.checkLikeStatus = async (req, res) => {
    try {
        const { id } = req.params

        // Get user ID from token
        const userId = req.user?.id || req.user?._id || req.user?.userId || req.agent?.id

        if (!userId) {
            return res.status(401).json({ error: "User ID not found in token" })
        }

        // Check if user has already liked this post
        const existingLike = await Like.findOne({ post: id, user: userId })

        res.status(200).json({
            success: true,
            data: {
                hasLiked: !!existingLike,
            },
        })
    } catch (error) {
        console.error("Error checking like status:", error)
        res.status(500).json({ error: error.message })
    }
}
