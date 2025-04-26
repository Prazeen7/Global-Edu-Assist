"use client"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline } from "@mui/material"
import ChatSystem from "../../../components/ChatSystem"
import PostSystem from "../../../components/Agents/PostSystem"
import ProfileMenu from "../../../components/Agents/ProfileMenu"
import { useEffect } from "react"

// Enhanced theme with better typography and color palette
const theme = createTheme({
    palette: {
        primary: {
            main: "#4f46e5",
            light: "#818cf8",
            dark: "#3730a3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#f43f5e",
        },
        background: {
            default: "#f9fafb",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                    },
                },
            },
        },
    },
})

function Dashboard() {
    // Set user type to agent when this component mounts
    useEffect(() => {
        localStorage.setItem("userType", "agent")
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                <AppBar
                    position="sticky"
                    sx={{
                        bgcolor: "background.paper",
                        color: "text.primary",
                        boxShadow: "none",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                        <Typography
                            variant="h6"
                            component="div"
                            color="primary"
                            sx={{
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                letterSpacing: "-0.025em",
                            }}
                        >
                            AgentHub
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                "& > *": {
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-1px)",
                                    },
                                },
                            }}
                        >
                            <ChatSystem />
                            <ProfileMenu />
                        </Box>
                    </Toolbar>
                </AppBar>

                <Container
                    maxWidth="md"
                    sx={{
                        py: 4,
                        "& > * + *": {
                            mt: 4,
                        },
                    }}
                >
                    <PostSystem />
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Dashboard
