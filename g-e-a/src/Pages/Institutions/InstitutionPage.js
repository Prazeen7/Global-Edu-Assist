import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  Chip,
  TextField,
} from "@mui/material";
import Grid from "@mui/joy/Grid";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import axios from "axios";
import "./institutions.css";

export default function InstitutionPage() {
  const { id } = useParams();
  const location = useLocation();
  const [institution, setInstitution] = useState(location.state || null);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [agentScrollIndex, setAgentScrollIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const agentsRef = useRef(null);
  const bannerIntervalRef = useRef(null);

  // Fetch institution data
  useEffect(() => {
    if (!location.state) {
      axios
        .get(`http://localhost:3001/institutions/${id}`)
        .then((response) => {
          setInstitution(response.data);
        })
        .catch((error) => {
          console.error("Error fetching institution:", error);
        });
    }
  }, [id, location.state]);

  // Auto-play banner
  const startBannerInterval = () => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % (institution?.bannerImages?.length || 1));
    }, 5000);
  };

  useEffect(() => {
    startBannerInterval();
    return () => clearInterval(bannerIntervalRef.current);
  }, [institution]);

  // Handle banner navigation
  const handleBannerNavigation = (direction) => {
    clearInterval(bannerIntervalRef.current);
    if (direction === "left") {
      setCurrentBannerIndex(
        (prev) => (prev - 1 + (institution?.bannerImages?.length || 1)) % (institution?.bannerImages?.length || 1)
      );
    } else {
      setCurrentBannerIndex((prev) => (prev + 1) % (institution?.bannerImages?.length || 1));
    }
    startBannerInterval();
  };

  // Handle agent navigation
  const handleAgentScroll = (direction) => {
    const cardWidth = 300; // Width of each card
    const gap = 24; // Gap between cards
    const scrollAmount = (cardWidth + gap) * 3 * (direction === "left" ? -1 : 1);

    if (agentsRef.current) {
      agentsRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }

    setAgentScrollIndex((prev) => {
      const newIndex = prev + (direction === "left" ? -3 : 3);
      return Math.max(0, Math.min(newIndex, (institution?.agents?.length || 0) - 3));
    });
  };

  // Filter programs based on search query
  const filteredPrograms = Object.entries(institution?.programs || {}).filter(([programName]) =>
    programName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading state if data is not available
  if (!institution) {
    return <Typography>Loading...</Typography>;
  }

  // Structured Content Data
  const tabContent = [
    // Overview Tab
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        About {institution.university}
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="left" sx={{ lineHeight: 1.6 }}>
        {institution.overview}
      </Typography>
    </Paper>,

    // Locations Tab
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Campuses
      </Typography>
      <Grid container spacing={3}>
        {institution.campuses.map((campus, index) => (
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
                  {campus}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>,

    // Programs Tab
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
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
        {filteredPrograms.map(([programName, programDetails], index) => (
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
                  {programName}
                </Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Level: ${programDetails.Level}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Duration: ${programDetails.duration}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Intakes: ${programDetails.intakes}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Fees: ${programDetails["Fees (first year)*"]} (annually)`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText primary={`Campus: ${programDetails.campuses}`} />
                  </ListItem>
                  {/* IELTS Data */}
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={`IELTS Requirement: ${programDetails.IELTS || "Not specified"}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  href={programDetails.url}
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
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Intakes
      </Typography>
      <Grid container spacing={3}>
        {institution.intakes.map((intake, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s, boxShadow 0.2s",
                "&:hover": {
                  transform: "scale(1)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium", textAlign: "center" }}>
                  {intake}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>,

    // Scholarships Tab
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Scholarships
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(institution.scholarships).map(([scholarshipName, scholarshipLink], index) => (
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
                  {scholarshipName}
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <a
                    href={scholarshipLink}
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
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
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
                primary={institution.academic_requirements.undergraduate}
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
                primary={institution.academic_requirements.postgraduate}
                primaryTypographyProps={{ fontWeight: "medium" }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Paper>,

    // Estimate Cost Tab
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
        Tuition Fees
      </Typography>
      <List>
        {institution.estimate.map((estimate, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemText primary={estimate} primaryTypographyProps={{ fontWeight: "medium" }} />
          </ListItem>
        ))}
      </List>
    </Paper>,

    // Documents Tab
    <Paper
      elevation={0} 
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "primary.main",
          fontWeight: "bold",
          mb: 2
        }}
      >
        Required Documents
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "text.secondary"
            }}
          >
            Offer Documents
          </Typography>
          <List dense>
            {Object.entries(institution.documents.Offer_letter).map(([key, value], index) => (
              <ListItem
                key={index}
                sx={{
                  py: 0.5,
                  px: 1
                }}
              >
                <ListItemText
                  primary={value}
                  primaryTypographyProps={{
                    fontWeight: "medium",
                    color: "text.primary"
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>,
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container sx={{ py: 4 }}>
        {/* Institution Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar
            src={institution.avatar}
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
            {institution.university}
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
                  src={image}
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
        <Box sx={{ mt: 6, userSelect: 'text' }}>
          <Typography variant="h5" fontWeight="bold" mb={4}>
            Authorized Agents
          </Typography>
          <Box sx={{ position: "relative" }}>
            {/* Left Scroll Button */}
            <IconButton
              onClick={() => handleAgentScroll("left")}
              disabled={agentScrollIndex === 0}
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "#4f46e5",
                color: "white",
                "&:hover": { backgroundColor: "#4338ca" },
                "&:disabled": { opacity: 0.5 },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Agents Cards Container */}
            <Box
              ref={agentsRef}
              sx={{
                display: "flex",
                gap: 3,
                overflowX: "auto",
                scrollBehavior: "smooth",
                px: 2,
                width: "100%",
                mx: "auto",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {Object.entries(institution.agents).map(([agentName, agentData], index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: 280,
                    width: 280,
                    height: 400,
                    flexShrink: 0,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s, boxShadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Card Content */}
                  <CardContent sx={{ textAlign: "center", flexGrow: 1, py: 2, overflow: "auto" }}>
                    <Avatar
                      src={agentData.avatar}
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
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
                      {agentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {agentData.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📞 {agentData.tel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ✉️ {agentData.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🌐{" "}
                      <a
                        href={agentData.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#4f46e5", textDecoration: "none" }}
                      >
                        Visit Website
                      </a>
                    </Typography>
                  </CardContent>

                  {/* Contact Agent Button */}
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
                      Contact Agent
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>

            {/* Right Scroll Button */}
            <IconButton
              onClick={() => handleAgentScroll("right")}
              disabled={agentScrollIndex >= (institution.agents?.length || 0) - 3}
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "#4f46e5",
                color: "white",
                "&:hover": { backgroundColor: "#4338ca" },
                "&:disabled": { opacity: 0.5 },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}