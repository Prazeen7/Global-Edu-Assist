import React, { useState, useEffect, useRef } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import {
  Tabs,
  Tab,
  Button,
  IconButton,
  Box,
  Card,
  CardContent,
  Avatar,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material"
import { ChevronLeft, ChevronRight, ExpandMore, Description } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import "./institutions.css"
import Loading from "../../components/Loading"

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: "12px 0",
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  "&:before": { display: "none" },
  "&.Mui-expanded": { margin: "12px 0" },
}))

const StyledTableHeader = styled(TableRow)(({ theme }) => ({
  "& th": {
    backgroundColor: "#f8fafc",
    color: "#4f46e5",
    fontWeight: 600,
    fontSize: "0.875rem",
    borderBottom: `2px solid #e2e8f0`,
  },
}))

// Update the AgentCard styled component to have fixed width
const AgentCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
  },
}))

export default function InstitutionPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [institution, setInstitution] = useState(location.state || null)
  const [tabIndex, setTabIndex] = useState(0)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [agentScrollIndex, setAgentScrollIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [documentCategories, setDocumentCategories] = useState([])
  const [allAgents, setAllAgents] = useState([])
  const agentsRef = useRef(null)
  const bannerIntervalRef = useRef(null)

  // Fetch institution data
  useEffect(() => {
    if (!location.state) {
      axios
        .get(`http://localhost:3001/api/institutions/${id}`)
        .then((response) => {
          setInstitution(response.data)
        })
        .catch((error) => {
          console.error("Error fetching institution:", error)
        })
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [id, location.state])

  // Fetch documents from the API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/documents")
      .then((response) => {
        const formattedData = response.data.map((category) => ({
          title: category.document,
          details: category.docs.map((doc, index) => ({
            name: doc,
            source: category.src[index],
            additional: category.info[index],
          })),
        }))
        setDocumentCategories(formattedData)
      })
      .catch((error) => {
        console.error("Error fetching documents:", error)
      })
  }, [])

  // Fetch all agents from the API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/availAgent")
      .then((response) => {
        setAllAgents(response.data)
      })
      .catch((error) => {
        console.error("Error fetching agents:", error)
      })
  }, [])

  const matchedAgents = institution?.agents
    ?.map((agentName) => {
      const agentData = allAgents.find((agent) => agent[agentName])
      if (!agentData) return null
      return {
        name: agentName,
        ...agentData[agentName],
      }
    })
    .filter((agent) => agent !== null)

  // Auto-play banner
  const startBannerInterval = () => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % (institution?.bannerImages?.length || 1))
    }, 5000)
  }

  useEffect(() => {
    startBannerInterval()
    return () => clearInterval(bannerIntervalRef.current)
  }, [institution])

  // Handle banner navigation
  const handleBannerNavigation = (direction) => {
    clearInterval(bannerIntervalRef.current)
    if (direction === "left") {
      setCurrentBannerIndex(
        (prev) => (prev - 1 + (institution?.bannerImages?.length || 1)) % (institution?.bannerImages?.length || 1),
      )
    } else {
      setCurrentBannerIndex((prev) => (prev + 1) % (institution?.bannerImages?.length || 1))
    }
    startBannerInterval()
  }

  // Handle agent navigation
  const handleAgentScroll = (direction) => {
    // Determine how many cards to show based on screen size
    let visibleCards = 3 // Default for desktop

    if (window.innerWidth < 600) {
      visibleCards = 1 // Mobile: show 1 card
    } else if (window.innerWidth < 960) {
      visibleCards = 2 // Tablet: show 2 cards
    }

    // Update the agent scroll index
    setAgentScrollIndex((prev) => {
      const newIndex = prev + (direction === "left" ? -1 : 1)
      return Math.max(0, Math.min(newIndex, (matchedAgents?.length || 0) - visibleCards))
    })
  }

  const extractMonths = (intakes) => {
    if (!intakes) return []
    const months = intakes
      .split(",")
      .map((intake) => intake.trim().split(" ")[0])
      .filter((month, index, self) => self.indexOf(month) === index)
    return months
  }

  // Filter programs based on search query
  const filteredPrograms = institution?.programs?.filter((program) =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Render loading state if data is not available
  if (!institution) {
    return <Loading />
  }

  // Structured Content Data
  const tabContent = [
    // Overview Tab
    <Paper
      key="overview"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        About {institution.institutionName}
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="left" sx={{ lineHeight: 1.6 }}>
        {institution.overview?.details}
      </Typography>
    </Paper>,

    // Locations Tab
    <Paper
      key="locations"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Campuses
      </Typography>
      <Grid container spacing={3}>
        {institution.locations?.map((location, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s, boxShadow 0.3s",
                "&:hover": {
                  transform: "scale(1)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium", textAlign: "center" }}>
                  {location.campusName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  {location.city}, {location.country}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>,

    // Programs Tab
    <Paper
      key="programs"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Programs Offered
      </Typography>
      <TextField
        fullWidth
        placeholder="Search programs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3}>
        {filteredPrograms?.map((program, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s, boxShadow 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ overflow: "auto", flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  {program.name}
                </Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Level: ${program.level}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Duration: ${program.duration}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Intakes: ${program.intakes}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Fees: ${program.firstYearFees}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText primary={`Campus: ${program.campuses}`} />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`IELTS Requirement: ${program.ielts || "Not specified"}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{
                    backgroundColor: "#4f46e5",
                    borderRadius: 2,
                    py: 1,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#4338ca",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>,

    // Intakes Tab
    <Paper
      key="intakes"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Intakes
      </Typography>
      <Grid container spacing={3}>
        {Array.from(new Set(institution.programs?.flatMap((program) => extractMonths(program.intakes)))).map(
          (month, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.2s, boxShadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "medium", textAlign: "center" }}>
                    {month}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ),
        )}
      </Grid>
    </Paper>,

    // Scholarships Tab
    <Paper
      key="scholarships"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Scholarships
      </Typography>
      <Grid container spacing={3}>
        {institution.scholarships?.map((scholarship, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                minHeight: 100,
                minWidth: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s, boxShadow 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium", textAlign: "center" }}>
                  {scholarship.name}
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <a
                    href={scholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#4f46e5",
                      textDecoration: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Learn More
                  </a>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>,

    // Entry Requirements Tab
    <Paper
      key="entryRequirements"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Entry Requirements
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Undergraduate
          </Typography>
          <List>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`GPA: ${institution.entryRequirements?.undergraduate?.GPA}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`IELTS: ${institution.entryRequirements?.undergraduate?.IELTS}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`PTE: ${institution.entryRequirements?.undergraduate?.PTE}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`TOEFL: ${institution.entryRequirements?.undergraduate?.TOEFL}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Postgraduate
          </Typography>
          <List>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`GPA: ${institution.entryRequirements?.postgraduate?.GPA}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`IELTS: ${institution.entryRequirements?.postgraduate?.IELTS}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`PTE: ${institution.entryRequirements?.postgraduate?.PTE}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary={`TOEFL: ${institution.entryRequirements?.postgraduate?.TOEFL}`}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Paper>,

    // Estimate Cost Tab
    <Paper
      key="estimateCost"
      elevation={3}
      sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
    >
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: "bold", mb: 3 }}>
          Cost Estimation Tool
        </Typography>

        <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            Use our comprehensive cost estimation tool to calculate your expenses from initial offer to visa application.
            Get a detailed breakdown of tuition fees, living expenses, visa costs, and more.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              // Check if user is logged in by looking for token in localStorage
              const token = localStorage.getItem("token");

              if (token) {
                // User is logged in, redirect directly to cost estimation page
                navigate("/cost-estimation");
              } else {
                // User is not logged in, redirect to login page with return URL
                navigate("/login", { state: { redirectTo: "/cost-estimation" } });
              }
            }}
            sx={{
              backgroundColor: "#4f46e5",
              borderRadius: 2,
              py: 1.5,
              px: 4,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#4338ca",
                transform: "scale(1.02)"
              }
            }}
          >
            START ESTIMATION
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary">
          Our cost estimation tool provides an approximate calculation based on current rates.
          Actual costs may vary based on individual circumstances and changes in fees or living expenses.
        </Typography>
      </Box>
    </Paper>,

    // Documents Tab
    <div key="documents" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: "#1e293b",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Description sx={{ color: "#4f46e5", fontSize: "2rem" }} />
          Required Documents
        </Typography>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Render fetched documents */}
          {documentCategories.map((category, index) => (
            <React.Fragment key={index}>
              <StyledAccordion>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "#4f46e5" }} />}
                  sx={{
                    "&:hover": { backgroundColor: "#f8fafc" },
                    padding: "0 16px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#e0e7ff",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4f46e5",
                        fontSize: "0.875rem",
                      }}
                    >
                      {index + 1}
                    </span>
                    {category.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ padding: 0 }}>
                  <TableContainer
                    sx={{
                      borderTop: "1px solid #e2e8f0",
                      borderRadius: "0 0 12px 12px",
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <StyledTableHeader>
                          <TableCell align="center" sx={{ width: "10%" }}>
                            S.N.
                          </TableCell>
                          <TableCell align="left" sx={{ width: "30%" }}>
                            Document
                          </TableCell>
                          <TableCell align="left" sx={{ width: "30%" }}>
                            Source
                          </TableCell>
                          <TableCell align="left" sx={{ width: "30%" }}>
                            Details
                          </TableCell>
                        </StyledTableHeader>
                      </TableHead>
                      <TableBody>
                        {category.details.map((doc, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              "&:last-child td": { borderBottom: 0 },
                              "&:hover": { backgroundColor: "#f8fafc" },
                            }}
                          >
                            <TableCell align="center" sx={{ color: "#64748b" }}>
                              {idx + 1}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                            <TableCell sx={{ color: "#4f46e5" }}>{doc.source}</TableCell>
                            <TableCell sx={{ color: "#64748b" }}>{doc.additional}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </StyledAccordion>

              {index < documentCategories.length - 1 && <Divider sx={{ my: 1, borderColor: "#e2e8f0" }} />}
            </React.Fragment>
          ))}

          {/* Render additional documents in cards */}
          {institution?.documents && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, color: "#4f46e5", fontWeight: 600 }}>
                Additional Documents
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(institution.documents).map(([key, value], idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: "transform 0.2s, boxShadow 0.2s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#1e293b", mb: 1 }}>
                          {key.replace(/_/g, " ")}
                        </Typography>
                        {Array.isArray(value) ? (
                          <List dense>
                            {value.map((item, itemIndex) => (
                              <ListItem key={itemIndex} sx={{ py: 0.5, px: 1 }}>
                                <ListItemText
                                  primary={item}
                                  primaryTypographyProps={{
                                    fontWeight: "medium",
                                    color: "text.primary",
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {value.toString()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </div>
      </div>
    </div>,
  ]

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container sx={{ py: 4 }}>
        {/* Institution Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar
            src={`http://localhost:3001/uploads/${institution.profilePicture}`}
            alt="Institution Logo"
            sx={{
              width: 100,
              height: 100,
              border: "2px solid #4f46e5",
              boxShadow: 3,
              "& img": {
                objectFit: "contain",
              },
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#333",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            {institution.institutionName}
          </Typography>
        </Box>

        {/* Banner Slideshow */}
        <Box
          sx={{
            position: "relative",
            height: 400,
            mb: 4,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          {/* Banner Images */}
          <Box
            sx={{
              display: "flex",
              width: `${(institution.bannerImages?.length || 1) * 100}%`,
              transform: `translateX(-${currentBannerIndex * (100 / (institution.bannerImages?.length || 1))}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {institution.bannerImages?.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / (institution.bannerImages?.length || 1)}%`,
                  height: 500,
                }}
              >
                <img
                  src={`http://localhost:3001/uploads/${image}`}
                  alt={`Campus ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Banner Navigation Buttons */}
          <IconButton
            onClick={() => handleBannerNavigation("left")}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => handleBannerNavigation("right")}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Tabs Section */}
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            "& .MuiTab-root": { fontWeight: "bold" },
            "& .Mui-selected": { color: "#4f46e5 !important" },
          }}
        >
          {[
            "Overview",
            "Locations",
            "Programs",
            "Intakes",
            "Scholarship",
            "Entry Requirements",
            "Estimate Cost",
            "Documents",
          ].map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ mb: 4 }}>{tabContent[tabIndex]}</Box>

        {/* Agents Section */}
        <Box sx={{ mt: 6, mb: 4, userSelect: "text" }}>
          <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
            Authorized Agents
          </Typography>

          {/* Mobile-optimized agent cards */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              mx: "auto",
              px: { xs: 2, sm: 4 }, // Padding for mobile and tablet
            }}
          >
            {/* Navigation buttons - positioned closer to content */}
            {matchedAgents?.length > 1 && (
              <>
                <IconButton
                  onClick={() => handleAgentScroll("left")}
                  disabled={agentScrollIndex === 0}
                  sx={{
                    position: "absolute",
                    left: { xs: -8, sm: -16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(79, 70, 229, 0.9)",
                    color: "white",
                    "&:hover": { backgroundColor: "#4338ca" },
                    "&:disabled": { opacity: 0.5 },
                    boxShadow: 2,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <IconButton
                  onClick={() => handleAgentScroll("right")}
                  disabled={
                    agentScrollIndex >=
                    (matchedAgents?.length || 0) - (window.innerWidth < 600 ? 1 : window.innerWidth < 960 ? 2 : 3)
                  }
                  sx={{
                    position: "absolute",
                    right: { xs: -8, sm: -16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(79, 70, 229, 0.9)",
                    color: "white",
                    "&:hover": { backgroundColor: "#4338ca" },
                    "&:disabled": { opacity: 0.5 },
                    boxShadow: 2,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}

            {/* Agent cards container with fixed width and height */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                overflow: "visible",
              }}
            >
              {/* Show one card on mobile, two on tablet, three on desktop */}
              {matchedAgents
                ?.slice(
                  agentScrollIndex,
                  agentScrollIndex + (window.innerWidth < 600 ? 1 : window.innerWidth < 960 ? 2 : 3),
                )
                .map((agent, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: { xs: "100%", sm: "300px" },
                      height: "400px",
                      flexShrink: 0,
                    }}
                  >
                    <AgentCard>
                      <CardContent
                        sx={{ textAlign: "center", flexGrow: 1, py: 2, display: "flex", flexDirection: "column" }}
                      >
                        <Avatar
                          src={`http://localhost:3001${agent?.head_office?.avatar}`}
                          sx={{
                            width: 80,
                            height: 80,
                            mx: "auto",
                            mb: 2,
                            "& img": {
                              objectFit: "cover",
                            },
                          }}
                        />
                        <Box
                          sx={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}
                        >
                          <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
                            {agent?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            📍 {agent?.head_office?.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            📞 {agent?.head_office?.tel}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            ✉️ {agent?.head_office?.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            🌐{" "}
                            <a
                              href={agent?.head_office?.web}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#4f46e5", textDecoration: "none" }}
                            >
                              Visit Website
                            </a>
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box sx={{ p: 2, flexShrink: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: "#4f46e5",
                            borderRadius: 2,
                            py: 1,
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#4338ca",
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          CONTACT AGENT
                        </Button>
                      </Box>
                    </AgentCard>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
