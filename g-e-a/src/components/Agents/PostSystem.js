import { useState, useEffect } from "react"
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Grid,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Avatar,
    InputBase,
} from "@mui/material"
import { Add, Delete, Edit, Image as ImageIcon, ThumbUp, Check, Close, AddPhotoAlternate } from "@mui/icons-material"

const PostSystem = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [agentInfo, setAgentInfo] = useState(null)

    // Form states
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("Study Abroad")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    // Inline edit states
    const [editingPostId, setEditingPostId] = useState(null)
    const [editTitle, setEditTitle] = useState("")
    const [editContent, setEditContent] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [editImage, setEditImage] = useState(null)
    const [editImagePreview, setEditImagePreview] = useState(null)
    const [savingEdit, setSavingEdit] = useState(false)

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState(null)

    // Brand color
    const brandColor = "#6366F1"

    // Fetch agent's posts and info on component mount
    useEffect(() => {
        fetchPosts()
        fetchAgentInfo()
    }, [])

    const fetchAgentInfo = async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                return
            }

            // Get agent ID from token
            const tokenData = parseJwt(token)
            const agentId = tokenData?.id || tokenData?.userId

            if (!agentId) {
                return
            }

            const response = await fetch(`http://localhost:3001/api/agent/${agentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setAgentInfo(data.data)
            }
        } catch (err) {
            console.error("Error fetching agent info:", err)
        }
    }

    // Helper function to parse JWT token
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]))
        } catch (e) {
            return null
        }
    }

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            if (!token) {
                setError("You must be logged in to view your posts")
                setLoading(false)
                return
            }

            console.log("Fetching posts with token:", token.substring(0, 10) + "...")

            // Fix: Use the correct endpoint for fetching agent's posts
            const response = await fetch("http://localhost:3001/api/posts/my-posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error("Error response:", errorData)
                throw new Error(`Failed to fetch posts: ${response.status}`)
            }

            const data = await response.json()
            console.log("Posts fetched successfully:", data)
            setPosts(data.data)
            setLoading(false)
        } catch (err) {
            console.error("Error fetching posts:", err)
            setError("Failed to load posts. Please try again.")
            setLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setEditImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setEditImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const resetForm = () => {
        setTitle("")
        setContent("")
        setCategory("Study Abroad")
        setImage(null)
        setImagePreview(null)
    }

    // Create new post
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            if (!token) {
                setError("You must be logged in to create a post")
                setLoading(false)
                return
            }

            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("category", category)

            if (image) {
                formData.append("image", image)
            }

            const response = await fetch("http://localhost:3001/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                console.error("Error response:", data)

                // Even if there's an error, try to fetch posts as the post might have been created
                await fetchPosts()

                if (data.success) {
                    setSuccess("Post created successfully!")
                    resetForm()
                } else {
                    throw new Error(`Failed to create post: ${response.status}`)
                }
            } else {
                // Update posts list
                setPosts([data.data, ...posts])
                setSuccess("Post created successfully!")
                resetForm()
            }

            setLoading(false)

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null)
            }, 3000)
        } catch (err) {
            console.error("Error creating post:", err)

            // Always try to fetch posts after an error
            fetchPosts()
            setSuccess("Post may have been created despite errors. Refreshing posts...")

            setLoading(false)

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError(null)
            }, 3000)
        }
    }

    // Start inline editing for a post
    const handleStartEdit = (post) => {
        setEditingPostId(post._id)
        setEditTitle(post.title)
        setEditContent(post.content)
        setEditCategory(post.category)
        setEditImage(null)
        setEditImagePreview(
            post.image?.url
                ? post.image.url.startsWith("http")
                    ? post.image.url
                    : `http://localhost:3001${post.image.url}`
                : null,
        )
    }

    // Cancel inline editing
    const handleCancelEdit = () => {
        setEditingPostId(null)
        setEditImage(null)
        setEditImagePreview(null)
    }

    // Remove image during editing
    const handleRemoveEditImage = () => {
        setEditImage(null)
        setEditImagePreview(null)
    }

    // Save inline edit changes
    const handleSaveEdit = async (postId) => {
        try {
            setSavingEdit(true)
            const token = localStorage.getItem("token")

            if (!token) {
                setError("You must be logged in to update a post")
                setSavingEdit(false)
                return
            }

            const formData = new FormData()
            formData.append("title", editTitle)
            formData.append("content", editContent)
            formData.append("category", editCategory)

            // If we have a new image, add it to the form data
            if (editImage) {
                formData.append("image", editImage)
            }

            // If we've removed the image (editImagePreview is null but the post had an image)
            if (!editImagePreview && posts.find((p) => p._id === postId)?.image) {
                formData.append("removeImage", "true")
            }

            const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(`Failed to update post: ${response.status}`)
            }

            // Update the post in the state
            setPosts(posts.map((post) => (post._id === postId ? data.data : post)))
            setSuccess("Post updated successfully!")

            // Clear edit state
            setEditingPostId(null)
            setEditImage(null)
            setEditImagePreview(null)

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null)
            }, 3000)
        } catch (err) {
            console.error("Error updating post:", err)
            setError("Failed to update post. Please try again.")

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError(null)
            }, 3000)
        } finally {
            setSavingEdit(false)
        }
    }

    const handleDeleteClick = (post) => {
        setPostToDelete(post)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            if (!token) {
                setError("You must be logged in to delete a post")
                setLoading(false)
                setDeleteDialogOpen(false)
                return
            }

            const response = await fetch(`http://localhost:3001/api/posts/${postToDelete._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to delete post: ${response.status}`)
            }

            // Remove post from state
            setPosts(posts.filter((post) => post._id !== postToDelete._id))
            setSuccess("Post deleted successfully!")

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null)
            }, 3000)
        } catch (err) {
            console.error("Error deleting post:", err)
            setError("Failed to delete post. Please try again.")

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError(null)
            }, 3000)
        } finally {
            setLoading(false)
            setDeleteDialogOpen(false)
            setPostToDelete(null)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Get agent profile picture URL
    const getProfilePictureUrl = () => {
        if (agentInfo?.profilePicture?.url) {
            return agentInfo.profilePicture.url
        }
        return null
    }

    return (
        <Box>
            {/* Page Header */}
            <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                Post Management
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Create and manage your posts to share with students and clients.
            </Typography>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            {/* Create New Post Form */}
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
            >
                <Typography variant="h6" fontWeight="600" mb={2}>
                    Create New Post
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Post Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            placeholder="Enter a descriptive title"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="Study Abroad">Study Abroad</MenuItem>
                                <MenuItem value="Visa Consulting">Visa Consulting</MenuItem>
                                <MenuItem value="Scholarship">Scholarship</MenuItem>
                                <MenuItem value="University Updates">University Updates</MenuItem>
                                <MenuItem value="Immigration News">Immigration News</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button component="label" variant="outlined" startIcon={<ImageIcon />} sx={{ height: "100%" }} fullWidth>
                            {imagePreview ? "Change Image" : "Upload Image"}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                    </Grid>

                    {imagePreview && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    height: 200,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    border: "1px solid rgba(0,0,0,0.12)",
                                }}
                            >
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Post preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        bgcolor: "rgba(255,255,255,0.8)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                                    }}
                                    onClick={() => {
                                        setImage(null)
                                        setImagePreview(null)
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            label="Post Content"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="outlined"
                            placeholder="Write your post content here..."
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                Create Post
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Posts List */}
            <Typography variant="h6" fontWeight="600" mb={2}>
                Your Posts
            </Typography>

            {loading && !editingPostId ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2,
                        bgcolor: "#f9fafb",
                        border: "1px dashed rgba(0,0,0,0.12)",
                    }}
                >
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        You haven't created any posts yet.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        Create Your First Post
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} key={post._id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                    },
                                    overflow: "hidden",
                                }}
                            >
                                {/* Header with Company Name and Date */}
                                <Box sx={{ p: 3, pb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Avatar
                                                src={getProfilePictureUrl()}
                                                sx={{
                                                    bgcolor: brandColor,
                                                    width: 42,
                                                    height: 42,
                                                    mr: 2,
                                                    border: `2px solid ${brandColor}20`,
                                                }}
                                            >
                                                {agentInfo?.companyName?.charAt(0) || post.title?.charAt(0) || "A"}
                                            </Avatar>
                                            <Box sx={{ textAlign: "left" }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.2 }}>
                                                    {agentInfo?.companyName || "Your Company"}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                                                        {formatDate(post.createdAt)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                                                        •
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontSize: "0.75rem",
                                                            fontWeight: 500,
                                                            color: brandColor,
                                                        }}
                                                    >
                                                        {editingPostId === post._id ? editCategory : post.category}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        {editingPostId === post._id ? (
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    aria-label="save edit"
                                                    onClick={() => handleSaveEdit(post._id)}
                                                    disabled={savingEdit}
                                                >
                                                    {savingEdit ? <CircularProgress size={20} /> : <Check fontSize="small" color="primary" />}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    aria-label="cancel edit"
                                                    onClick={handleCancelEdit}
                                                    disabled={savingEdit}
                                                >
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    aria-label="edit post"
                                                    onClick={() => handleStartEdit(post)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    aria-label="delete post"
                                                    onClick={() => handleDeleteClick(post)}
                                                >
                                                    <Delete fontSize="small" color="error" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {/* Post Content Section - Removed divider above title */}
                                <Box sx={{ px: 3, pb: 2 }}>
                                    {/* Post Title - Editable or Static */}
                                    {editingPostId === post._id ? (
                                        <InputBase
                                            fullWidth
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                fontSize: "1.5rem",
                                                color: "#333",
                                                lineHeight: 1.3,
                                                textAlign: "left",
                                                p: 1,
                                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                                borderRadius: 1,
                                                "&:focus": {
                                                    border: `1px solid ${brandColor}`,
                                                },
                                            }}
                                            placeholder="Post title"
                                        />
                                    ) : (
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                fontSize: "1.5rem",
                                                color: "#333",
                                                lineHeight: 1.3,
                                                textAlign: "left",
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                    )}

                                    {/* Post Content - Editable or Static */}
                                    {editingPostId === post._id ? (
                                        <InputBase
                                            fullWidth
                                            multiline
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            sx={{
                                                whiteSpace: "pre-line",
                                                mb: 3,
                                                color: "#555",
                                                lineHeight: 1.7,
                                                fontSize: "1rem",
                                                letterSpacing: "0.01em",
                                                textAlign: "left",
                                                p: 1,
                                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                                borderRadius: 1,
                                                "&:focus": {
                                                    border: `1px solid ${brandColor}`,
                                                },
                                            }}
                                            placeholder="Post content"
                                        />
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                whiteSpace: "pre-line",
                                                mb: 3,
                                                color: "#555",
                                                lineHeight: 1.7,
                                                fontSize: "1rem",
                                                letterSpacing: "0.01em",
                                                textAlign: "left",
                                            }}
                                        >
                                            {post.content}
                                        </Typography>
                                    )}

                                    {/* Category selector (only in edit mode) */}
                                    {editingPostId === post._id && (
                                        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                                            <InputLabel id={`category-label-${post._id}`}>Category</InputLabel>
                                            <Select
                                                labelId={`category-label-${post._id}`}
                                                value={editCategory}
                                                label="Category"
                                                onChange={(e) => setEditCategory(e.target.value)}
                                            >
                                                <MenuItem value="Study Abroad">Study Abroad</MenuItem>
                                                <MenuItem value="Visa Consulting">Visa Consulting</MenuItem>
                                                <MenuItem value="Scholarship">Scholarship</MenuItem>
                                                <MenuItem value="University Updates">University Updates</MenuItem>
                                                <MenuItem value="Immigration News">Immigration News</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}

                                    {/* Image editing controls (only in edit mode) */}
                                    {editingPostId === post._id && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                Post Image
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Button component="label" variant="outlined" startIcon={<AddPhotoAlternate />} size="small">
                                                    {editImagePreview ? "Change Image" : "Add Image"}
                                                    <input type="file" hidden accept="image/*" onChange={handleEditImageChange} />
                                                </Button>
                                                {editImagePreview && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        size="small"
                                                        onClick={handleRemoveEditImage}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                )}
                                            </Box>

                                            {editImagePreview && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        height: 200,
                                                        borderRadius: 2,
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "relative",
                                                        border: "1px solid rgba(0,0,0,0.12)",
                                                    }}
                                                >
                                                    <img
                                                        src={editImagePreview || "/placeholder.svg"}
                                                        alt="Post preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {/* Divider after post content - Only show if there's an image */}
                                    {((editingPostId === post._id && editImagePreview) ||
                                        (editingPostId !== post._id && post.image && post.image.url)) && (
                                            <Box sx={{ borderBottom: "2px solid rgba(0, 0, 0, 0.15)", mb: 2 }} />
                                        )}
                                </Box>

                                {/* Post Image - Full Width (only show in view mode or if there's an image in edit mode) */}
                                {editingPostId !== post._id && post.image && post.image.url && (
                                    <Box sx={{ width: "100%" }}>
                                        <img
                                            src={
                                                post.image.url.startsWith("http") ? post.image.url : `http://localhost:3001${post.image.url}`
                                            }
                                            alt={post.title}
                                            style={{
                                                width: "100%",
                                                display: "block",
                                            }}
                                            onError={(e) => {
                                                console.error("Image failed to load:", post.image.url)

                                                // Try multiple possible URL formats
                                                const possibleUrls = [
                                                    `http://localhost:3001${post.image.url}`,
                                                    `http://localhost:3001/uploads/${post.image.filename}`,
                                                    `http://localhost:3001/uploads/posts/${post.image.filename}`,
                                                    `http://localhost:3001/uploads/image-${post.image.filename?.split("image-")[1] || ""}`,
                                                ]

                                                // Find the current URL in the possible URLs
                                                const currentUrlIndex = possibleUrls.findIndex((url) => url === e.target.src)

                                                // Try the next URL if available
                                                if (currentUrlIndex < possibleUrls.length - 1) {
                                                    const nextUrl = possibleUrls[currentUrlIndex + 1]
                                                    console.log("Trying alternative URL:", nextUrl)
                                                    e.target.src = nextUrl
                                                } else {
                                                    // If we've tried all URLs, use placeholder
                                                    e.target.src = "/placeholder.svg"
                                                }
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Post Actions */}
                                <Box
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        borderTop: "2px solid rgba(0, 0, 0, 0.15)",
                                    }}
                                >
                                    <Button
                                        startIcon={<ThumbUp />}
                                        size="small"
                                        sx={{
                                            color: brandColor,
                                            fontWeight: 500,
                                            textTransform: "none",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {post.likes || 0} Likes
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PostSystem
