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
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
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

// Create a theme with the brand color
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    background: {
      default: "#ffffff", // Changed to white
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
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
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
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
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
}))

const ObjectiveItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

const ObjectiveIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main + "15",
  color: theme.palette.primary.main,
}))

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "John Doe",
      title: "CEO & Founder",
      description: "With over 15 years of industry experience, John leads our company with vision and expertise.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Jane Smith",
      title: "Operations Director",
      description:
        "Jane ensures our day-to-day operations run smoothly and efficiently to deliver exceptional results.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Michael Johnson",
      title: "Technical Lead",
      description: "Michael brings innovative technical solutions to our clients with his extensive expertise.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  // Objectives data
  const objectives = [
    "To provide exceptional service and solutions to our clients",
    "To maintain the highest standards of quality and professionalism",
    "To foster innovation and continuous improvement in our processes",
    "To build lasting relationships with our clients and partners",
    "To contribute positively to the communities we serve",
    "To create a supportive and collaborative work environment",
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
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {/* Page Title */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              About{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Us
              </Box>
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Learn more about our company, our mission, and the team behind our success.
            </Typography>
          </Box>

          {/* Who are we section */}
          <Box sx={{ mb: 8 }}>
            <SectionTitle>
              <Typography variant="h4">Who are we</Typography>
              <SectionDivider />
            </SectionTitle>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderLeft: 4,
                    borderColor: "primary.main",
                  }}
                >
                  <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                    We are a dedicated team of professionals committed to providing exceptional service in our industry.
                    Founded in 2010, our organization has grown from a small startup to a leading provider of solutions
                    for our clients worldwide. Our passion for excellence and innovation drives everything we do.
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                    With a focus on quality and customer satisfaction, we strive to exceed expectations in every project
                    we undertake. Our experienced team brings diverse skills and perspectives to tackle complex
                    challenges and deliver outstanding results.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    overflow: "hidden",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/placeholder.svg?height=400&width=400"
                    alt="Company image"
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Our Objectives section */}
          <Box sx={{ mb: 8 }}>
            <SectionTitle>
              <Typography variant="h4">Our Objectives</Typography>
              <SectionDivider />
            </SectionTitle>

            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {objectives.map((objective, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <ObjectiveItem alignItems="flex-start">
                      <ListItemIcon>
                        <ObjectiveIcon>{objectiveIcons[index]}</ObjectiveIcon>
                      </ListItemIcon>
                      <ListItemText primary={objective} />
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
                <Typography variant="h4">Contact Us</Typography>
                <SectionDivider />
              </SectionTitle>

              <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
                <List sx={{ mb: 2 }}>
                  <ListItem sx={{ bgcolor: "grey.100", borderRadius: 2, mb: 2, p: 2 }}>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact No."
                      secondary={
                        <Typography variant="body1" color="primary.main" fontWeight="bold">
                          +1 (555) 123-4567
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ bgcolor: "grey.100", borderRadius: 2, mb: 2, p: 2 }}>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={
                        <Typography variant="body1" color="primary.main" fontWeight="bold">
                          info@yourcompany.com
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ bgcolor: "grey.100", borderRadius: 2, mb: 2, p: 2 }}>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary="123 Business Avenue, Suite 100, Enterprise City, EC 12345"
                    />
                  </ListItem>
                </List>

                <Button variant="contained" fullWidth size="large" endIcon={<SendIcon />}>
                  Send us a message
                </Button>
              </Paper>
            </Grid>

            {/* Our Team section */}
            <Grid item xs={12} md={8}>
              <SectionTitle>
                <Typography variant="h4">Our Team</Typography>
                <SectionDivider />
              </SectionTitle>

              <Grid container spacing={3}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <TeamCard elevation={3}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={member.image}
                        alt={`${member.name} profile`}
                        sx={{
                          position: "relative",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "50%",
                            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          },
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
                          {member.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.description}
                        </Typography>
                      </CardContent>
                    </TeamCard>
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