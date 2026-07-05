import { ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material"
import { SupervisorAccount } from "@mui/icons-material"
import { Link, useLocation } from "react-router-dom"

function SuperAdminMenu({ isSuperAdmin }) {
  const location = useLocation()

  // Debug output to check if the component is receiving the correct props
  console.log("SuperAdminMenu - isSuperAdmin:", isSuperAdmin)

  // If not a super admin, don't render anything
  if (!isSuperAdmin) {
    console.log("Not a super admin, not rendering menu")
    return null
  }

  // Check if the current path is the manage admins page
  const isManageAdminsActive = location.pathname === "/admin/manage-admins"

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to="/admin/manage-admins"
        selected={isManageAdminsActive}
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
        <ListItemIcon sx={{ color: isManageAdminsActive ? "white" : "inherit" }}>
          <SupervisorAccount />
        </ListItemIcon>
        <ListItemText primary="Admin Management" />
      </ListItemButton>
    </ListItem>
  )
}

export default SuperAdminMenu
