import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material"
import { Search, ChevronLeft, ChevronRight, KeyboardArrowDown, Favorite, ChatBubbleOutline } from "@mui/icons-material"
import '../Institutions/institutions.css'

// Styled components
const StyledAgentCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 300,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}))

const StyledPostCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}))

const PostImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
  padding: theme.spacing(2),
  opacity: 0,
  transition: "opacity 0.3s",
  color: "white",
}))

const PostCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 400,
  position: "relative",
  "&:hover .overlay": {
    opacity: 1,
  },
}))

const LoadMoreButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.primary.dark,
    transform: "translateY(-100%)",
    transition: "transform 0.3s",
    zIndex: 0,
  },
  "&:hover::before": {
    transform: "translateY(0)",
  },
  "& .buttonText": {
    position: "relative",
    zIndex: 1,
  },
}))

const AgentDirectoryPage = () => {
  // Sample data
  const agents = [
    {
      id: 1,
      name: "John Smith",
      address: "123 Main St, City",
      contactNo: "+1 234 567 8901",
      email: "john@example.com",
      specialty: "Study Abroad",
      rating: 4.8,
      initials: "JS",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      address: "456 Oak Ave, Town",
      contactNo: "+1 234 567 8902",
      email: "sarah@example.com",
      specialty: "Visa Consulting",
      rating: 4.9,
      initials: "SJ",
    },
    {
      id: 3,
      name: "Michael Brown",
      address: "789 Pine Rd, Village",
      contactNo: "+1 234 567 8903",
      email: "michael@example.com",
      specialty: "Scholarship Guidance",
      rating: 4.7,
      initials: "MB",
    },
    {
      id: 4,
      name: "Emily Davis",
      address: "101 Elm St, County",
      contactNo: "+1 234 567 8904",
      email: "emily@example.com",
      specialty: "Test Preparation",
      rating: 4.6,
      initials: "ED",
    },
    {
      id: 5,
      name: "Robert Wilson",
      address: "202 Cedar Ln, District",
      contactNo: "+1 234 567 8905",
      email: "robert@example.com",
      specialty: "Career Counseling",
      rating: 4.9,
      initials: "RW",
    },
  ]

  const posts = [
    {
      id: 1,
      title: "New Scholarship Opportunity",
      content:
        "Exciting news! We've partnered with University of Technology to offer 5 full scholarships for international students. Applications open next week. Don't miss this opportunity to study at one of the top universities.",
      agent: agents[0],
      category: "Study Abroad",
      postedAt: "2 days ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Study in Canada - Information Session",
      content:
        "Join our virtual information session about studying in Canada. Learn about visa requirements, top universities, and cost of living. Expert speakers will share insights and answer your questions.",
      agent: agents[1],
      category: "Visa Consulting",
      postedAt: "3 days ago",
      likes: 36,
      comments: 12,
    },
    {
      id: 3,
      title: "UK Student Visa Updates",
      content:
        "Important updates to UK student visa requirements for 2025. New financial requirements and application process changes. Make sure you're prepared for these changes if you're planning to study in the UK.",
      agent: agents[2],
      category: "Scholarship",
      postedAt: "5 days ago",
      likes: 18,
      comments: 5,
    },
    {
      id: 4,
      title: "Australia Student Accommodation Guide",
      content:
        "Everything you need to know about student accommodation in Australia. On-campus vs. off-campus options compared. Find the best housing solution for your budget and preferences.",
      agent: agents[3],
      category: "Test Prep",
      postedAt: "1 week ago",
      likes: 42,
      comments: 15,
    },
    {
      id: 5,
      title: "IELTS Preparation Workshop",
      content:
        "Join our free IELTS preparation workshop. Learn tips and strategies to improve your score from experienced trainers. Limited seats available, register now to secure your spot.",
      agent: agents[4],
      category: "Career",
      postedAt: "1 week ago",
      likes: 29,
      comments: 7,
    },
    {
      id: 6,
      title: "USA University Application Deadlines",
      content:
        "Important deadlines for Fall 2025 admissions to top US universities. Early action, early decision, and regular decision dates. Plan your applications accordingly to maximize your chances.",
      agent: {
        name: "Agent B",
        initials: "AB",
      },
      category: "Admissions",
      postedAt: "2 weeks ago",
      likes: 33,
      comments: 9,
    },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            mb: 6,
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

          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", md: "auto" }, maxWidth: 400 }}>
            <TextField
              placeholder="Search agents..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Available Agents Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Chip
            label="Available Agents"
            sx={{
              bgcolor: "#eef2ff",
              color: "#4f46e5",
              fontWeight: 500,
              fontSize: "1rem",
              py: 1,
              px: 1,
              height: "auto",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>

        {/* Agent Cards Carousel */}
        <Box sx={{ position: "relative", mb: 8 }}>
          <IconButton
            sx={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#eef2ff" },
            }}
            aria-label="Previous agents"
          >
            <ChevronLeft />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              pb: 4,
              pt: 1,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {agents.map((agent) => (
              <StyledAgentCard key={agent.id} elevation={1}>
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ position: "relative", mb: 2 }}>
                    <Chip
                      label={`${agent.rating} ★`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#4f46e5",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                    <Avatar
                      sx={{
                        width: 96,
                        height: 96,
                        bgcolor: "#f5f5f5",
                        border: "2px solid #e0e7ff",
                      }}
                    >
                      Logo
                    </Avatar>
                  </Box>

                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight={500}>
                      {agent.specialty}
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 3,
                      width: "100%",
                      bgcolor: "#f9fafb",
                    }}
                  >
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                        Email:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agent.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                        Contact:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agent.contactNo}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                        Address:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agent.address}
                      </Typography>
                    </Box>
                  </Paper>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#4f46e5",
                      "&:hover": { bgcolor: "#4338ca" },
                    }}
                  >
                    Message Agent
                  </Button>
                </CardContent>
              </StyledAgentCard>
            ))}
          </Box>

          <IconButton
            sx={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#eef2ff" },
            }}
            aria-label="Next agents"
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Scroll Indicator */}
        <Box sx={{ position: "relative", mb: 8 }}>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "center", mt: -1.5 }}>
            <Chip
              icon={<KeyboardArrowDown sx={{ animation: "bounce 1s infinite" }} />}
              label="Scroll to see what agents are offering"
              sx={{
                px: 2,
                bgcolor: "white",
                boxShadow: 1,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Agent Posts Section */}
        <Box sx={{ mb: 8 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              Latest Updates from Agents
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" size="small">
                Recent
              </Button>
              <Button variant="outlined" size="small">
                Popular
              </Button>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} md={12} lg={12} key={post.id}>
                <StyledPostCard elevation={1}>
                  <PostCardMedia
                    sx={{ bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Typography color="text.disabled">Post Image</Typography>
                    <PostImageOverlay className="overlay">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {post.title}
                      </Typography>
                    </PostImageOverlay>
                  </PostCardMedia>

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            bgcolor: "#eef2ff",
                            color: "#4f46e5",
                            border: "1px solid #c7d2fe",
                            width: 40,
                            height: 40,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          {post.agent.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{post.agent.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posted {post.postedAt}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.content}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: "text.disabled", "&:hover": { color: "#4f46e5" } }}>
                            <Favorite fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {post.likes}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: "text.disabled", "&:hover": { color: "#4f46e5" } }}>
                            <ChatBubbleOutline fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" color="text.secondary">
                            {post.comments}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        sx={{
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                          "&:hover": { bgcolor: "#e0e7ff" },
                        }}
                      >
                        Contact Agent
                      </Button>
                    </Box>
                  </CardContent>
                </StyledPostCard>
              </Grid>
            ))}
          </Grid>

          {/* Load More Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <LoadMoreButton
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              <span className="buttonText">Load More Posts</span>
            </LoadMoreButton>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AgentDirectoryPage

