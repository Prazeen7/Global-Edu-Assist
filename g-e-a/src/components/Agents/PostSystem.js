"use client"

import { useState } from "react"
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    TextField,
    Button,
    Box,
    Divider,
    Paper,
} from "@mui/material"
import {
    Favorite as FavoriteIcon,
    ChatBubbleOutline as ChatBubbleOutlineIcon,
    Share as ShareIcon,
    Image as ImageIcon,
    Send as SendIcon,
} from "@mui/icons-material"

const PostSystem = () => {
    const [showImageUpload, setShowImageUpload] = useState(false)

    const toggleImageUpload = () => {
        setShowImageUpload(!showImageUpload)
    }

    const posts = [
        {
            id: 1,
            author: {
                name: "John Doe",
                avatar: "/abstract-agent.png",
            },
            timePosted: "2 hours ago",
            image: "/modern-living-exterior.png",
            caption:
                "Just listed! Beautiful modern home in the heart of the city. 4 bedrooms, 3 bathrooms, and an amazing view. Contact me for a viewing!",
            likes: 12,
            comments: 4,
        },
        {
            id: 2,
            author: {
                name: "Jane Smith",
                avatar: "/futuristic-cityscape-agent.png",
            },
            timePosted: "5 hours ago",
            image: "/sleek-city-apartment.png",
            caption:
                "Check out this newly renovated apartment downtown! Perfect for young professionals. Open house this Saturday from 1-4pm.",
            likes: 8,
            comments: 2,
        },
        {
            id: 3,
            author: {
                name: "Robert Johnson",
                avatar: "/abstract-geometric-shapes.png",
            },
            timePosted: "yesterday",
            image: "/secluded-villa-oasis.png",
            caption:
                "Exclusive listing! Luxury villa with private pool and garden. Perfect for families looking for privacy and comfort. Call me for details!",
            likes: 24,
            comments: 7,
        },
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Post Creation Form */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Create a Post" />
                <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField placeholder="Write a caption for your post..." multiline rows={3} fullWidth variant="outlined" />

                        <Button
                            startIcon={<ImageIcon />}
                            onClick={toggleImageUpload}
                            color="primary"
                            sx={{ alignSelf: "flex-start" }}
                        >
                            Add Image
                        </Button>

                        {showImageUpload && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderStyle: "dashed",
                                    "&:hover": { bgcolor: "grey.50" },
                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
                                    <ImageIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Click to upload an image
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                        PNG, JPG, GIF up to 10MB
                                    </Typography>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                    <Button variant="contained" color="primary" startIcon={<SendIcon />}>
                        Post
                    </Button>
                </CardActions>
            </Card>

            {/* Posts Feed */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader
                            avatar={
                                <Avatar src={post.author.avatar} alt={post.author.name}>
                                    {post.author.name.substring(0, 2)}
                                </Avatar>
                            }
                            title={post.author.name}
                            subheader={`Posted ${post.timePosted}`}
                        />
                        <CardContent sx={{ p: 0 }}>
                            <Box
                                component="img"
                                src={post.image}
                                alt="Property listing"
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body1">{post.caption}</Typography>
                            </Box>
                        </CardContent>
                        <Divider />
                        <CardActions disableSpacing>
                            <Button startIcon={<FavoriteIcon />} size="small" color="inherit">
                                {post.likes}
                            </Button>
                            <Button startIcon={<ChatBubbleOutlineIcon />} size="small" color="inherit">
                                {post.comments}
                            </Button>
                            <Button startIcon={<ShareIcon />} size="small" color="inherit">
                                Share
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default PostSystem
