import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout"; // Add LogoutIcon
import useMediaQuery from "@mui/material/useMediaQuery";
import { SidebarContext } from "../../layouts/Admin/DashboardLayout";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
    },
}));

function Sidebar() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate(); // Add useNavigate
    const { isOpen, toggle } = useContext(SidebarContext);
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    // Updated menuItems with correct nested paths
    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
        { text: "Institution Management", icon: <BusinessIcon />, path: "/admin/institutions" },
        { text: "Documents Management", icon: <DescriptionIcon />, path: "/admin/documents" },
        { text: "Agent Management", icon: <PeopleIcon />, path: "/admin/agents" },
        { text: "Landing Page", icon: <HomeIcon />, path: "/admin/landingPage" },
        { text: "About Section", icon: <ArticleIcon />, path: "/admin/about" },
        { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
    ];

    // Logout function
    const handleLogout = () => {
        // Clear authentication data from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userAvatar");
        localStorage.removeItem("userType");

        // Redirect to admin login page
        navigate("/admin");
    };

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
                {menuItems.slice(0, 4).map((item) => (
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
            <Typography variant="overline" display="block" sx={{ px: 2, pt: 2, opacity: 0.7 }}>
                Content
            </Typography>
            <List>
                {menuItems.slice(4, 6).map((item) => (
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
            <Typography variant="overline" display="block" sx={{ px: 2, pt: 2, opacity: 0.7 }}>
                System
            </Typography>
            <List>
                {menuItems.slice(6).map((item) => (
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
    );

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
    );
}

export default Sidebar;