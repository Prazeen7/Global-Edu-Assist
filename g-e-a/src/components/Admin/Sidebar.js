import { useContext, useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import DashboardIcon from "@mui/icons-material/Dashboard"
import BusinessIcon from "@mui/icons-material/Business"
import DescriptionIcon from "@mui/icons-material/Description"
import PeopleIcon from "@mui/icons-material/People"
import HomeIcon from "@mui/icons-material/Home"
import ArticleIcon from "@mui/icons-material/Article"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import useMediaQuery from "@mui/material/useMediaQuery"
import { SidebarContext } from "../../layouts/Admin/DashboardLayout"
import SuperAdminMenu from "./SuperAdminMenu"
import parseJwt from "../../utils/parseJwt"
import axios from "axios"

// Create a basic axios instance for this component
const api = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3001/api" : "/api",
})

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("auth")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const drawerWidth = 240

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
    },
}))

function Sidebar() {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const { isOpen, toggle } = useContext(SidebarContext)
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkSuperAdminStatus()
    }, [])

    const checkSuperAdminStatus = async () => {
        setIsLoading(true)
        try {
            // Get token from localStorage - check both possible keys
            const token = localStorage.getItem("auth") || localStorage.getItem("token")

            if (!token) {
                console.log("No token found")
                setIsSuperAdmin(false)
                setIsLoading(false)
                return
            }

            // First try to decode the token locally using parseJwt
            const decodedToken = parseJwt(token)
            console.log("Decoded token data:", decodedToken)

            if (decodedToken && decodedToken.superAdmin === true) {
                console.log("User is a super admin (from token)")
                setIsSuperAdmin(true)
                setIsLoading(false)
                return
            } else if (decodedToken) {
                console.log("User is not a super admin (from token)")
                setIsSuperAdmin(false)
                setIsLoading(false)
                return
            }

            // If we couldn't determine from the token, make an API call
            console.log("Making API call to verify token")

            // Use the configured axios instance
            const response = await api.get("/auth/verify-token")

            console.log("API response:", response.data)

            if (response.data.user && response.data.user.superAdmin === true) {
                console.log("User is a super admin (from API)")
                setIsSuperAdmin(true)
            } else {
                console.log("User is not a super admin")
                setIsSuperAdmin(false)
            }
        } catch (error) {
            console.error("Error checking super admin status:", error)
            // IMPORTANT: Do not set hardcoded super admin status
            setIsSuperAdmin(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Updated menuItems with correct nested paths
    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
        { text: "Institution Management", icon: <BusinessIcon />, path: "/admin/institutions" },
        { text: "Documents Management", icon: <DescriptionIcon />, path: "/admin/documents" },
        { text: "Agent Management", icon: <PeopleIcon />, path: "/admin/agents" },
    ]

    // Logout function
    const handleLogout = () => {
        // Clear authentication data from local storage
        localStorage.removeItem("token")
        localStorage.removeItem("auth")
        localStorage.removeItem("userAvatar")
        localStorage.removeItem("userType")

        // Redirect to admin login page
        navigate("/admin")
    }

    const drawer = (
        <>
            <DrawerHeader>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2 }}>
                    Global Edu Assist
                </Typography>
                {isMobile && (
                    <IconButton onClick={toggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </DrawerHeader>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "primary.dark",
                                    },
                                    "& .MuiListItemIcon-root": {
                                        color: "white",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? "white" : "inherit" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />

            {/* Super Admin Menu */}
            {!isLoading && <SuperAdminMenu isSuperAdmin={isSuperAdmin} />}

            <Divider />
            {/* Logout Button */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    )

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    display: { xs: "block", lg: "none" },
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Global Edu Assist
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
                {isMobile ? (
                    <StyledDrawer
                        variant="temporary"
                        open={isOpen}
                        onClose={toggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </StyledDrawer>
                ) : (
                    <StyledDrawer variant="persistent" open={isOpen}>
                        {drawer}
                    </StyledDrawer>
                )}
            </Box>
        </>
    )
}

export default Sidebar
