"use client"

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import {
  LocationOn,
  Mail,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  ThumbUpAltOutlined,
  ThumbUp,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect, useContext } from "react"
import { AuthContext } from "../../Context/context"

const AgentsPage = () => {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [agents, setAgents] = useState([])
  const [filteredAgents, setFilteredAgents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { LoggedIn } = useContext(AuthContext)

  // Posts state
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState(null)

  // Add a new state variable to store agent information
  const [agentDetails, setAgentDetails] = useState({})

  // Add state variables for tracking likes
  const [likingPost, setLikingPost] = useState(null)
  const [likedPosts, setLikedPosts] = useState({})

  // Alert state
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Add a function to fetch agent details for posts
  const fetchAgentDetails = async (agentId) => {
    try {
      // Skip if we already have this agent's details
      if (agentDetails[agentId]) return

      const response = await fetch(`http://localhost:3001/api/agent/${agentId}`)

      if (!response.ok) {
        console.error(`Failed to fetch agent details: ${response.status}`)
        return
      }

      const data = await response.json()

      // Store agent details in state
      setAgentDetails((prev) => ({
        ...prev,
        [agentId]: data.data,
      }))
    } catch (err) {
      console.error("Error fetching agent details:", err)
    }
  }

  // Check if user has already liked posts
  const checkLikedPosts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !LoggedIn) return

      // For each post, check if the user has liked it
      for (const post of posts) {
        try {
          const response = await fetch(`http://localhost:3001/api/posts/${post._id}/like-status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.data.hasLiked) {
              setLikedPosts((prev) => ({
                ...prev,
                [post._id]: true,
              }))
            }
          }
        } catch (err) {
          console.error(`Error checking like status for post ${post._id}:`, err)
        }
      }
    } catch (err) {
      console.error("Error checking liked posts:", err)
    }
  }

  // Handle like with backend API call
  const handleLike = async (postId) => {
    try {
      // Prevent multiple clicks or liking already liked posts
      if (likingPost === postId || likedPosts[postId]) {
        if (likedPosts[postId]) {
          setAlertInfo({
            open: true,
            message: "You have already liked this post",
            severity: "info",
          })
        }
        return
      }

      setLikingPost(postId)

      // Get token
      const token = localStorage.getItem("token")
      if (!token) {
        setAlertInfo({
          open: true,
          message: "You must be logged in to like posts",
          severity: "error",
        })
        setLikingPost(null)
        return
      }

      // Optimistically update UI
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post)))
      setLikedPosts((prev) => ({ ...prev, [postId]: true }))

      // Make API call to update likes on server
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // If API call fails, revert the optimistic update
        setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)))
        setLikedPosts((prev) => ({ ...prev, [postId]: false }))

        setAlertInfo({
          open: true,
          message: data.message || "Failed to like post",
          severity: "error",
        })
        return
      }

      // Update with the actual like count from the server
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: data.data.likes } : post)))

      setAlertInfo({
        open: true,
        message: "Post liked successfully",
        severity: "success",
      })
    } catch (err) {
      console.error("Error liking post:", err)
      setAlertInfo({
        open: true,
        message: "Error liking post. Please try again.",
        severity: "error",
      })

      // Revert optimistic update on error
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)))
      setLikedPosts((prev) => ({ ...prev, [postId]: false }))
    } finally {
      setLikingPost(null)
    }
  }

  // Handle alert close
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setAlertInfo((prev) => ({ ...prev, open: false }))
  }

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (scrollRef.current) {
        setContainerWidth(scrollRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        // Use the correct API endpoint with the base URL
        const response = await fetch("http://localhost:3001/api/getAgent")

        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Filter only approved agents for public display
        const approvedAgents = data.data.filter((agent) => agent.status === "approved")
        setAgents(approvedAgents)
        setFilteredAgents(approvedAgents)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching agents:", err)
        setError("Failed to load agents. Please try again later.")
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true)
        console.log("Fetching posts from API...")

        const response = await fetch("http://localhost:3001/api/posts")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error response data:", errorData)
          throw new Error(`Failed to fetch posts: ${response.status} - ${errorData.error || "Unknown error"}`)
        }

        const data = await response.json()
        console.log("Posts fetched successfully:", data)
        setPosts(data.data)

        // Fetch agent details for each post
        data.data.forEach((post) => {
          if (post.agent) {
            fetchAgentDetails(post.agent)
          }
        })

        setLoadingPosts(false)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setPostsError(`Failed to load latest updates: ${err.message}`)
        setLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [])

  // Check liked posts after posts are loaded and user is logged in
  useEffect(() => {
    if (posts.length > 0 && LoggedIn) {
      checkLikedPosts()
    }
  }, [posts, LoggedIn])

  // Filter agents based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAgents(agents)
    } else {
      const filtered = agents.filter(
        (agent) =>
          agent.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (agent.headOfficeAddress && agent.headOfficeAddress.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredAgents(filtered)
    }
  }, [searchTerm, agents])

  // Function to handle starting a chat with an agent
  const handleMessageAgent = (agent) => {
    // Check if user is logged in
    if (!LoggedIn) {
      console.log("User not logged in according to AuthContext")
      setAlertInfo({
        open: true,
        message: "Please log in to chat with agents",
        severity: "warning",
      })
      navigate("/login")
      return
    }

    // Check if agent exists and has an _id
    if (!agent || !agent._id) {
      console.error("Invalid agent data:", agent)
      return
    }

    console.log("Dispatching messageAgent event for agent:", agent.companyName)
    // Dispatch a custom event that the ChatSystem component listens for
    const messageAgentEvent = new CustomEvent("messageAgent", {
      detail: { agent },
    })
    window.dispatchEvent(messageAgentEvent)
  }

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = containerWidth / 3 // Width of each card (3 cards per view)
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

      // Update scroll position for button visibility
      setTimeout(() => {
        if (scrollRef.current) {
          setScrollPosition(scrollRef.current.scrollLeft)
        }
      }, 300)
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Extract initials from company name for avatar
  const getInitials = (name) => {
    if (!name) return "AG"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Address not available"
    return address.length > 60 ? `${address.substring(0, 60)}...` : address
  }

  // Fix profile picture URL to use the correct base URL
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture || !profilePicture.url) return null

    // If the URL is already absolute, use it as is
    if (profilePicture.url.startsWith("http")) {
      return profilePicture.url
    }

    // Otherwise, construct the full URL with the correct base
    return `http://localhost:3001${profilePicture.url}`
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate card width based on container width to show exactly 3 cards
  const cardWidth = containerWidth ? (containerWidth - 48) / 3 : 280 // 48px for gaps (16px * 3)

  // Check if we can scroll in a direction
  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollRef.current
    ? scrollRef.current.scrollWidth > scrollRef.current.clientWidth + scrollPosition
    : true

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            mb: 5,
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Find Your Perfect Agent
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connect with experienced education consultants to guide your journey
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              placeholder="Search agents..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                flexGrow: 1,
                minWidth: { xs: "100%", sm: 250, md: 300 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  height: "100%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,0,0,0.15)",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { py: 1.25 },
              }}
            />
          </Box>
        </Box>

        {/* Success message */}
        {/* Education Consultant Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: 6,
            mt: 2,
            py: 3,
            px: { xs: 3, sm: 4 },
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.12)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#4b5563", fontWeight: 600, mb: { xs: 2, sm: 0 } }}>
            Are you an education consultant?
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#6366F1",
                color: "white",
                fontWeight: 600,
                py: 1,
                px: 2.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.875rem",
                boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
                "&:hover": {
                  bgcolor: "#4F46E5",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                },
              }}
              onClick={() => navigate("/agent-login")}
            >
              Login as Agent
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#6366F1",
                color: "#6366F1",
                fontWeight: 600,
                py: 1,
                px: 2.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.875rem",
                "&:hover": {
                  borderColor: "#4F46E5",
                  bgcolor: "rgba(99, 102, 241, 0.05)",
                },
              }}
              onClick={() => navigate("/agent-registration")}
            >
              Register as Agent
            </Button>
          </Box>
        </Box>

        {/* Available Agents Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Available Agents
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                sx={{
                  bgcolor: "#EEF2FF",
                  color: "#6366F1",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#DFE4FF" },
                  "&.Mui-disabled": {
                    bgcolor: "#F9FAFB",
                    color: "rgba(0,0,0,0.26)",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                sx={{
                  bgcolor: "#EEF2FF",
                  color: "#6366F1",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#DFE4FF" },
                  "&.Mui-disabled": {
                    bgcolor: "#F9FAFB",
                    color: "rgba(0,0,0,0.26)",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#6366F1" }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : filteredAgents.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No agents found matching your search criteria.
              </Typography>
            </Box>
          ) : (
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 3,
                pb: 2,
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                msOverflowStyle: "none", // Hide scrollbar for IE/Edge
                "&::-webkit-scrollbar": {
                  display: "none", // Hide scrollbar for Chrome/Safari
                },
              }}
              onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
            >
              {filteredAgents.map((agent) => (
                <Card
                  key={agent._id}
                  sx={{
                    width: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    maxWidth: `${cardWidth}px`,
                    flexShrink: 0,
                    bgcolor: "#ffffff",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                      {agent.profilePicture && agent.profilePicture.url ? (
                        <Avatar
                          src={getProfilePictureUrl(agent.profilePicture)}
                          alt={agent.companyName}
                          sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#EEF2FF",
                            color: "#6366F1",
                            fontSize: "1.75rem",
                            fontWeight: "bold",
                            mb: 2,
                            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
                          }}
                        >
                          {getInitials(agent.companyName)}
                        </Avatar>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {agent.companyName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6366F1",
                          mb: 1,
                          fontWeight: 600,
                          bgcolor: "#EEF2FF",
                          px: 2,
                          py: 0.5,
                          borderRadius: 10,
                          mt: 1,
                        }}
                      >
                        Education Consultant
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Mail fontSize="small" sx={{ color: "#6366F1", mr: 1 }} />
                        <Typography variant="body2">{agent.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Phone fontSize="small" sx={{ color: "#6366F1", mr: 1 }} />
                        <Typography variant="body2">{agent.contactNumber || "Not provided"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <LocationOn fontSize="small" sx={{ color: "#6366F1", mr: 1, mt: 0.3 }} />
                        <Typography variant="body2">{formatAddress(agent.headOfficeAddress)}</Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleMessageAgent(agent)}
                      sx={{
                        bgcolor: "#6366F1",
                        mt: 2,
                        py: 1.2,
                        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
                        "&:hover": {
                          bgcolor: "#4F46E5",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                        },
                      }}
                    >
                      Message Agent
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Latest Updates Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Latest Updates from Agents
          </Typography>

          {loadingPosts ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#6366F1" }} />
            </Box>
          ) : postsError ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {postsError}
            </Alert>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No updates available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {posts.slice(0, 3).map((post) => (
                <Grid item xs={12} key={post._id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      },
                      overflow: "hidden",
                      p: 3,
                    }}
                  >
                    {/* Header with Company Name and Date */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={
                          agentDetails[post.agent]?.profilePicture?.url
                            ? getProfilePictureUrl(agentDetails[post.agent].profilePicture)
                            : null
                        }
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          border: "2px solid #f0f0f0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        {getInitials(agentDetails[post.agent]?.companyName || "")}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            lineHeight: 1.2,
                            textAlign: "left",
                          }}
                        >
                          {agentDetails[post.agent]?.companyName || "Loading..."}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                            {formatDate(post.createdAt)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1.5,
                              color: "#6366F1",
                              fontWeight: 500,
                              fontSize: "0.875rem",
                            }}
                          >
                            • {post.category}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Post Content Section */}
                    <Box sx={{ mb: 3 }}>
                      {/* Post Title */}
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

                      {/* Post Content */}
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
                    </Box>

                    {/* Post Image */}
                    {post.image && post.image.url && (
                      <Box sx={{ width: "100%", mb: 3 }}>
                        <img
                          src={
                            post.image.url.startsWith("http")
                              ? post.image.url
                              : `http://localhost:3001${post.image.url}`
                          }
                          alt={post.title}
                          style={{
                            width: "100%",
                            display: "block",
                            borderRadius: "8px",
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
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Button
                          startIcon={likedPosts[post._id] ? <ThumbUp /> : <ThumbUpAltOutlined />}
                          onClick={() => handleLike(post._id)}
                          disabled={likingPost === post._id}
                          sx={{
                            color: likedPosts[post._id] ? "#4F46E5" : "#6366F1",
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                            },
                          }}
                        >
                          {post.likes || 0} Likes
                          {likingPost === post._id && <CircularProgress size={16} sx={{ ml: 1, color: "#6366F1" }} />}
                        </Button>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => handleMessageAgent(agentDetails[post.agent])}
                        sx={{
                          color: "#6366F1",
                          borderColor: "#6366F1",
                          "&:hover": {
                            borderColor: "#4F46E5",
                            bgcolor: "rgba(99, 102, 241, 0.05)",
                          },
                          py: 0.7,
                          px: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Send Message
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {posts.length > 3 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#6366F1",
                  color: "#6366F1",
                  "&:hover": {
                    borderColor: "#4F46E5",
                  },
                  py: 1,
                  px: 3,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                Load More Posts
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity={alertInfo.severity} variant="filled" sx={{ width: "100%" }}>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AgentsPage
