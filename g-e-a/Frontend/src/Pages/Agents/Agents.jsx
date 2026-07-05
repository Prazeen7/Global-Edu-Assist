import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
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
  KeyboardArrowDown,
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
  const [visiblePosts, setVisiblePosts] = useState(3) // Track number of posts to display

  // Agent details state
  const [agentDetails, setAgentDetails] = useState({})

  // Like state
  const [likingPost, setLikingPost] = useState(null)
  const [likedPosts, setLikedPosts] = useState({})

  // Alert state
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch agent details
  const fetchAgentDetails = async (agentId) => {
    try {
      if (agentDetails[agentId]) return
      const response = await fetch(`http://localhost:3001/api/agent/${agentId}`)
      if (!response.ok) {
        console.error(`Failed to fetch agent details: ${response.status}`)
        return
      }
      const data = await response.json()
      setAgentDetails((prev) => ({
        ...prev,
        [agentId]: data.data,
      }))
    } catch (err) {
      console.error("Error fetching agent details:", err)
    }
  }

  // Check liked posts
  const checkLikedPosts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !LoggedIn) return
      for (const post of posts) {
        try {
          const response = await fetch(`http://localhost:3001/api/posts/${post._id}/like-status`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.data.hasLiked) {
              setLikedPosts((prev) => ({ ...prev, [post._id]: true }))
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

  // Handle like
  const handleLike = async (postId) => {
    try {
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
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post)))
      setLikedPosts((prev) => ({ ...prev, [postId]: true }))
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)))
        setLikedPosts((prev) => ({ ...prev, [postId]: false }))
        setAlertInfo({
          open: true,
          message: data.message || "Failed to like post",
          severity: "error",
        })
        return
      }
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
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)))
      setLikedPosts((prev) => ({ ...prev, [postId]: false }))
    } finally {
      setLikingPost(null)
    }
  }

  // Handle alert close
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return
    setAlertInfo((prev) => ({ ...prev, open: false }))
  }

  // Update container width
  useEffect(() => {
    const updateWidth = () => {
      if (scrollRef.current) setContainerWidth(scrollRef.current.offsetWidth)
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/api/getAgent")
        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.status}`)
        }
        const data = await response.json()
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

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true)
        const response = await fetch("http://localhost:3001/api/posts")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Failed to fetch posts: ${response.status} - ${errorData.error || "Unknown error"}`)
        }
        const data = await response.json()
        setPosts(data.data)
        data.data.forEach((post) => {
          if (post.agent) fetchAgentDetails(post.agent)
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

  // Check liked posts
  useEffect(() => {
    if (posts.length > 0 && LoggedIn) checkLikedPosts()
  }, [posts, LoggedIn])

  // Filter agents
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

  // Handle message agent
  const handleMessageAgent = (agent) => {
    if (!LoggedIn) {
      setAlertInfo({
        open: true,
        message: "Please log in to chat with agents",
        severity: "warning",
      })
      navigate("/login")
      return
    }
    if (!agent || !agent._id) {
      console.error("Invalid agent data:", agent)
      return
    }
    const messageAgentEvent = new CustomEvent("messageAgent", { detail: { agent } })
    window.dispatchEvent(messageAgentEvent)
  }

  // Handle scroll
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = containerWidth / 3
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setTimeout(() => {
        if (scrollRef.current) setScrollPosition(scrollRef.current.scrollLeft)
      }, 300)
    }
  }

  // Handle search
  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  // Scroll to latest updates
  const scrollToLatestUpdates = () => {
    const latestUpdatesSection = document.getElementById("latest-updates")
    if (latestUpdatesSection) latestUpdatesSection.scrollIntoView({ behavior: "smooth" })
  }

  // Handle load more posts
  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 3)
  }

  // Utility functions
  const getInitials = (name) => (name ? name.split(" ").map((word) => word[0]).join("").substring(0, 2).toUpperCase() : "AG")
  const formatAddress = (address) => (address ? (address.length > 60 ? `${address.substring(0, 60)}...` : address) : "Address not available")
  const getProfilePictureUrl = (profilePicture) =>
    profilePicture && profilePicture.url
      ? profilePicture.url.startsWith("http")
        ? profilePicture.url
        : `http://localhost:3001${profilePicture.url}`
      : null
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const cardWidth = containerWidth ? (containerWidth - 48) / 3 : 280
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
          <Button
            variant="contained"
            onClick={scrollToLatestUpdates}
            endIcon={<KeyboardArrowDown />}
            sx={{
              bgcolor: "#6366F1",
              color: "white",
              fontWeight: 600,
              py: 1,
              px: 2.5,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "#4F46E5", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" },
              alignSelf: { xs: "center", md: "flex-start" },
              minWidth: { xs: "auto", md: "220px" },
              height: 40,
            }}
          >
            Explore Agent Updates
          </Button>
        </Box>

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
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
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
                "&:hover": { bgcolor: "#4F46E5", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" },
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
                "&:hover": { borderColor: "#4F46E5", bgcolor: "rgba(99, 102, 241, 0.05)" },
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Available Agents</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search agents..."
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  width: { xs: "100%", sm: 220 },
                  "& .MuiOutlinedInput-root": { borderRadius: 1, height: "100%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.15)" },
                  display: { xs: "none", sm: "block" },
                }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" color="action" /></InputAdornment>, sx: { py: 0.75 } }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  sx={{
                    bgcolor: "#EEF2FF",
                    color: "#6366F1",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "#DFE4FF" },
                    "&.Mui-disabled": { bgcolor: "#F9FAFB", color: "rgba(0,0,0,0.26)" },
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
                    "&.Mui-disabled": { bgcolor: "#F9FAFB", color: "rgba(0,0,0,0.26)" },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mb: 3, display: { xs: "block", sm: "none" } }}>
            <TextField
              placeholder="Search agents..."
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.15)" },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" color="action" /></InputAdornment>, sx: { py: 0.75 } }}
            />
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#6366F1" }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          ) : filteredAgents.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">No agents found matching your search criteria.</Typography>
            </Box>
          ) : (
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 3,
                pb: 2,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
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
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                      {agent.profilePicture && agent.profilePicture.url ? (
                        <Avatar
                          src={getProfilePictureUrl(agent.profilePicture)}
                          alt={agent.companyName}
                          sx={{ width: 80, height: 80, mb: 2, boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)" }}
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
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{agent.companyName}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6366F1", mb: 1, fontWeight: 600, bgcolor: "#EEF2FF", px: 2, py: 0.5, borderRadius: 10, mt: 1 }}
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
                        mt: "auto",
                        py: 1.2,
                        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
                        "&:hover": { bgcolor: "#4F46E5", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" },
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
        <Box id="latest-updates" sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: "left" }}>
            Latest Updates from Agents
          </Typography>
          {loadingPosts ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#6366F1" }} />
            </Box>
          ) : postsError ? (
            <Alert severity="error" sx={{ mb: 4 }}>{postsError}</Alert>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">No updates available at the moment.</Typography>
            </Box>
          ) : (
            <Box sx={{ maxWidth: "680px", mx: "auto" }}>
              {posts.slice(0, visiblePosts).map((post) => (
                <Card
                  key={post._id}
                  sx={{
                    borderRadius: { xs: 0, sm: "8px" },
                    boxShadow: { xs: "none", sm: "0 1px 2px rgba(0,0,0,0.2)" },
                    border: { xs: "none", sm: "1px solid rgba(0,0,0,0.1)" },
                    mb: 3,
                    overflow: "hidden",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <Avatar
                      src={
                        agentDetails[post.agent]?.profilePicture?.url
                          ? getProfilePictureUrl(agentDetails[post.agent].profilePicture)
                          : null
                      }
                      sx={{ width: 40, height: 40, mr: 1.5 }}
                    >
                      {getInitials(agentDetails[post.agent]?.companyName || "")}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.2, textAlign: "left" }}
                      >
                        {agentDetails[post.agent]?.companyName || "Loading..."}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", textAlign: "left" }}>
                        {formatDate(post.createdAt)} • {post.category}
                      </Typography>
                    </Box>
                  </Box>
                  {post.title && (
                    <Typography
                      variant="h6"
                      sx={{ px: 2, pb: 1.5, fontWeight: 600, fontSize: "1.1rem", textAlign: "left" }}
                    >
                      {post.title}
                    </Typography>
                  )}
                  {post.content && (
                    <Typography
                      variant="body1"
                      sx={{ px: 2, pb: post.image && post.image.url ? 2 : 0, fontSize: "0.95rem", whiteSpace: "pre-line", textAlign: "left" }}
                    >
                      {post.content}
                    </Typography>
                  )}
                  {post.image && post.image.url && (
                    <Box sx={{ width: "100%" }}>
                      <img
                        src={post.image.url.startsWith("http") ? post.image.url : `http://localhost:3001${post.image.url}`}
                        alt={post.title || "Post image"}
                        style={{ width: "100%", display: "block" }}
                        onError={(e) => {
                          const possibleUrls = [
                            `http://localhost:3001${post.image.url}`,
                            `http://localhost:3001/uploads/${post.image.filename}`,
                            `http://localhost:3001/uploads/posts/${post.image.filename}`,
                            `http://localhost:3001/uploads/image-${post.image.filename?.split("image-")[1] || ""}`,
                          ]
                          const currentUrlIndex = possibleUrls.findIndex((url) => url === e.target.src)
                          if (currentUrlIndex < possibleUrls.length - 1) {
                            e.target.src = possibleUrls[currentUrlIndex + 1]
                          } else {
                            e.target.src = "/placeholder.svg"
                          }
                        }}
                      />
                    </Box>
                  )}
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pb: 2 }}>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Button
                        startIcon={likedPosts[post._id] ? <ThumbUp /> : <ThumbUpAltOutlined />}
                        onClick={() => handleLike(post._id)}
                        disabled={likingPost === post._id}
                        sx={{
                          color: likedPosts[post._id] ? "#4F46E5" : "#6366F1",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" },
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
                        "&:hover": { borderColor: "#4F46E5", bgcolor: "rgba(99, 102, 241, 0.05)" },
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
              ))}
              {posts.length > visiblePosts && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    sx={{
                      borderColor: "#6366F1",
                      color: "#6366F1",
                      "&:hover": { borderColor: "#4F46E5" },
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
          )}
        </Box>
      </Container>
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