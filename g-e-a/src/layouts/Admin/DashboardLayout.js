import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Sidebar from "../../components/Admin/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Create a context for sidebar state
export const SidebarContext = React.createContext({
    isOpen: true,
    toggle: () => {},
    close: () => {},
});

const drawerWidth = 0; 
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile" })(
    ({ theme, open, isMobile }) => ({
        flexGrow: 1,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: isMobile ? 0 : open ? `${drawerWidth}px` : 0, 
        width: isMobile ? "100%" : `calc(100% - ${open ? drawerWidth : 0}px)`,
        backgroundColor: "transparent", 
        padding: theme.spacing(3),
    })
);

function DashboardLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const [isOpen, setIsOpen] = useState(!isMobile);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close }}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <Main open={isOpen} isMobile={isMobile}>
                    <Outlet /> {/* Render nested routes here */}
                </Main>
            </Box>
        </SidebarContext.Provider>
    );
}

export default DashboardLayout;