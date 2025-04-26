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
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  ChatBubbleOutline,
  Favorite,
  LocationOn,
  Mail,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
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
      alert("Please log in to chat with agents")
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

  // Calculate card width based on container width to show exactly 3 cards
  const cardWidth = containerWidth ? (containerWidth - 48) / 3 : 280 // 48px for gaps (16px * 3)

  // Check if we can scroll in a direction
  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollRef.current
    ? scrollRef.current.scrollWidth > scrollRef.current.clientWidth + scrollPosition
    : true

  // Sample posts data for the "Latest Updates" section
  const posts = [
    {
      id: 1,
      title: "New Scholarship Opportunity",
      content:
        "Exciting news! We've partnered with University of Technology to offer 5 full scholarships for international students. Applications open next week.",
      agent: filteredAgents[0] || { companyName: "Education Consultant", initials: "EC" },
      category: "Study Abroad",
      postedAt: "2 days ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Study in Canada - Information Session",
      content:
        "Join our virtual information session about studying in Canada. Learn about visa requirements, top universities, and cost of living.",
      agent: filteredAgents[1] || { companyName: "Visa Expert", initials: "VE" },
      category: "Visa Consulting",
      postedAt: "3 days ago",
      likes: 36,
      comments: 12,
    },
    {
      id: 3,
      title: "UK Student Visa Updates",
      content:
        "Important updates to UK student visa requirements for 2025. New financial requirements and application process changes.",
      agent: filteredAgents[2] || { companyName: "Global Education", initials: "GE" },
      category: "Scholarship",
      postedAt: "5 days ago",
      likes: 18,
      comments: 5,
    },
  ]

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

          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "#ffffff",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "#EEF2FF",
                        color: "#6366F1",
                        mr: 3,
                        boxShadow: "0 2px 8px rgba(99, 102, 241, 0.2)",
                      }}
                    >
                      {post.agent.initials || getInitials(post.agent.companyName)}
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {post.agent.companyName}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                          {post.postedAt}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#9CA3AF" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6366F1",
                            fontWeight: 600,
                            bgcolor: "#EEF2FF",
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 10,
                            fontSize: "0.75rem",
                          }}
                        >
                          {post.category}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {post.title}
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {post.content}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          height: 180,
                          bgcolor: "#EEF2FF",
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#6366F1", fontWeight: 500 }}>
                          {post.category} Image
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton size="small" sx={{ color: "#F43F5E", mr: 0.5 }}>
                          <Favorite fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {post.likes}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton size="small" sx={{ color: "#6366F1", mr: 0.5 }}>
                          <ChatBubbleOutline fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {post.comments}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => (post.agent && post.agent._id ? handleMessageAgent(post.agent) : null)}
                      sx={{
                        color: "#6366F1",
                        borderColor: "#6366F1",
                        "&:hover": {
                          borderColor: "#4F46E5",
                          bgcolor: "rgba(99, 102, 241, 0.05)",
                        },
                        py: 0.7,
                        px: 2,
                      }}
                    >
                      Contact Agent
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

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
        </Box>

        {/* Simple Footer */}
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Agent Directory. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2" color="#6366F1" sx={{ cursor: "pointer", fontWeight: 500 }}>
              Terms
            </Typography>
            <Typography variant="body2" color="#6366F1" sx={{ cursor: "pointer", fontWeight: 500 }}>
              Privacy
            </Typography>
            <Typography variant="body2" color="#6366F1" sx={{ cursor: "pointer", fontWeight: 500 }}>
              Contact
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AgentsPage
