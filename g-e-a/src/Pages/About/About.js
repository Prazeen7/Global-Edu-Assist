"use client"
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import LooksOneIcon from "@mui/icons-material/LooksOne"
import LooksTwoIcon from "@mui/icons-material/LooksTwo"
import Looks3Icon from "@mui/icons-material/Looks3"
import Looks4Icon from "@mui/icons-material/Looks4"
import Looks5Icon from "@mui/icons-material/Looks5"
import Looks6Icon from "@mui/icons-material/Looks6"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SendIcon from "@mui/icons-material/Send"
import BusinessIcon from "@mui/icons-material/Business"
import EngineeringIcon from "@mui/icons-material/Engineering"
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import TwitterIcon from "@mui/icons-material/Twitter"
import GitHubIcon from "@mui/icons-material/GitHub"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import "../Institutions/institutions.css"

// Create a theme with the brand color
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
      light: "#6366F1",
      dark: "#4338CA",
    },
    secondary: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
})

// Custom styled components
const SectionTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}))

const SectionDivider = styled(Divider)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  opacity: 0.2,
  height: 2,
}))

const TeamCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "all 0.3s ease-in-out",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
  },
}))

const ObjectiveItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main + "08",
    transform: "translateX(4px)",
  },
}))

const ObjectiveIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
  boxShadow: "0 2px 8px rgba(79, 70, 229, 0.2)",
}))

const TeamMemberAvatar = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginTop: -50,
  boxShadow: "0 4px 20px rgba(79, 70, 229, 0.25)",
  border: `4px solid ${theme.palette.background.paper}`,
}))

const ContactItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main + "08",
    transform: "translateX(4px)",
  },
}))

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  marginRight: theme.spacing(1),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    transform: "translateY(-2px)",
  },
}))

export default function AboutPage() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  // Team members data with icons instead of images
  const teamMembers = [
    {
      name: "John Doe",
      title: "CEO & Founder",
      description: "With over 15 years of industry experience, John leads our company with vision and expertise.",
      icon: <SupervisorAccountIcon sx={{ fontSize: 50 }} />,
      socialLinks: [
        { icon: <LinkedInIcon />, url: "#" },
        { icon: <TwitterIcon />, url: "#" },
        { icon: <GitHubIcon />, url: "#" },
      ],
    },
    {
      name: "Jane Smith",
      title: "Operations Director",
      description:
        "Jane ensures our day-to-day operations run smoothly and efficiently to deliver exceptional results.",
      icon: <BusinessIcon sx={{ fontSize: 50 }} />,
      socialLinks: [
        { icon: <LinkedInIcon />, url: "#" },
        { icon: <TwitterIcon />, url: "#" },
      ],
    },
    {
      name: "Michael Johnson",
      title: "Technical Lead",
      description: "Michael brings innovative technical solutions to our clients with his extensive expertise.",
      icon: <EngineeringIcon sx={{ fontSize: 50 }} />,
      socialLinks: [
        { icon: <LinkedInIcon />, url: "#" },
        { icon: <GitHubIcon />, url: "#" },
      ],
    },
  ]

  // Objectives data
  const objectives = [
    "Help students explore and compare institutions, programs, and locations based on their academic and personal preferences.",
    "Provide detailed information about each institution, including scholarships, requirements, tuition fees, and required documentation",
    "Enable students to use advanced search filters to refine options by program level, fees, GPA, English proficiency, and more.",
    "Offer clear and accessible documentation guidance to support students during their application process.",
    "Allow students to estimate total costs from application submission to visa approval.",
    "Facilitate seamless communication between students and agents through an in-platform messaging system.",
  ]

  // Icons for objectives
  const objectiveIcons = [
    <LooksOneIcon key="1" />,
    <LooksTwoIcon key="2" />,
    <Looks3Icon key="3" />,
    <Looks4Icon key="4" />,
    <Looks5Icon key="5" />,
    <Looks6Icon key="6" />,
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          {/* Page Title */}
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: "#4f46e5",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.6,
              }}
            >
              Learn more about our company, our mission, and the team behind our success.
            </Typography>
          </Box>

          {/* Who are we section */}
          <Box sx={{ mb: 10 }}>
            <SectionTitle>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Who are we
              </Typography>
              <SectionDivider />
            </SectionTitle>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderLeft: 6,
                    borderColor: "primary.main",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
                      zIndex: -1,
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: "1.1rem", lineHeight: 1.8, color: "text.primary" }}
                  >
                    We are a comprehensive digital platform designed to empower prospective international students by simplifying their 
                    journey from exploring academic opportunities to achieving visa approval. Our system serves as a bridge between students 
                    and educational institutions, offering curated access to programs, scholarships, estimated costs, and application 
                    requirements. By integrating advanced search tools, cost estimators, real-time guidance, and communication features, 
                    we help students make informed decisions tailored to their academic goals, financial capacity, and personal preferences. 
                    At the same time, we provide a space for verified educational agents to share services, facilitating trusted connections 
                    between students and expert guidance throughout their journey.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    overflow: "hidden",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 120, color: "primary.main", mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: "text.primary" }}>
                    Established in 2010
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                    Over a decade of excellence in service
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Our Objectives section */}
          <Box sx={{ mb: 10 }}>
            <SectionTitle>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Our Objectives
              </Typography>
              <SectionDivider />
            </SectionTitle>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)",
                border: "1px solid rgba(79, 70, 229, 0.1)",
              }}
            >
              <Grid container spacing={3}>
                {objectives.map((objective, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <ObjectiveItem alignItems="flex-start">
                      <ListItemIcon>
                        <ObjectiveIcon>{objectiveIcons[index]}</ObjectiveIcon>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                            {objective}
                          </Typography>
                        }
                      />
                    </ObjectiveItem>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          {/* Contact Us and Our Team sections */}
          <Grid container spacing={4}>
            {/* Contact Us section */}
            <Grid item xs={12} md={4}>
              <SectionTitle>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Contact Us
                </Typography>
                <SectionDivider />
              </SectionTitle>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)",
                  border: "1px solid rgba(79, 70, 229, 0.1)",
                }}
              >
                <List sx={{ mb: 3 }}>
                  <ContactItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PhoneIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Contact No.
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" color="primary.main" fontWeight="bold" sx={{ mt: 0.5 }}>
                          +1 (555) 123-4567
                        </Typography>
                      }
                    />
                  </ContactItem>

                  <ContactItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <EmailIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" color="primary.main" fontWeight="bold" sx={{ mt: 0.5 }}>
                          info@yourcompany.com
                        </Typography>
                      }
                    />
                  </ContactItem>

                  <ContactItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <LocationOnIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                          123 Business Avenue, Suite 100, Enterprise City, EC 12345
                        </Typography>
                      }
                    />
                  </ContactItem>
                </List>
              </Paper>
            </Grid>

            {/* Our Team section */}
            <Grid item xs={12} md={8}>
              <SectionTitle>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Our Team
                </Typography>
                <SectionDivider />
              </SectionTitle>

              <Grid container spacing={3}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ position: "relative", pt: 6 }}>
                      <TeamCard elevation={0}>
                        <Box
                          sx={{
                            height: 80,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }}
                        />
                        <TeamMemberAvatar>{member.icon}</TeamMemberAvatar>
                        <CardContent sx={{ textAlign: "center", pt: 5 }}>
                          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "primary.main",
                              fontWeight: 500,
                              mb: 2,
                              background: "linear-gradient(90deg, #4f46e5 0%, #10B981 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {member.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {member.description}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            {member.socialLinks.map((link, i) => (
                              <SocialIconButton key={i} size="small" aria-label="social link" href={link.url}>
                                {link.icon}
                              </SocialIconButton>
                            ))}
                          </Box>
                        </CardContent>
                      </TeamCard>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
