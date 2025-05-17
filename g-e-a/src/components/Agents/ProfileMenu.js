"use client"

import { useState, useEffect, useContext, useRef } from "react"
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    CircularProgress,
    Link,
    List,
    ListItem,
    Paper,
    TextField,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Badge,
} from "@mui/material"
import {
    Person as PersonIcon,
    Logout as LogoutIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material"
import axios from "../../utils/axiosConfig"
import { AuthContext } from "../../Context/context"

// Base URL for API
const API_BASE_URL = "http://localhost:3001"

const ProfileMenu = () => {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState(null)
    const [profileOpen, setProfileOpen] = useState(false)
    const open = Boolean(anchorEl)
    const [agent, setAgent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    // Edit mode state
    const [editMode, setEditMode] = useState(false)
    // Initialize formData with empty values to prevent null errors
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        website: "",
        contactNumber: "",
        headOfficeAddress: "",
        owners: [],
        branches: [],
    })
    const [saving, setSaving] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

    // Profile picture state
    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePictureFile, setProfilePictureFile] = useState(null)
    const [profilePicturePreview, setProfilePicturePreview] = useState(null)

    const { setLoggedIn, setUserType } = useContext(AuthContext) || {}

    const fetchAgentData = async () => {
        try {
            setLoading(true)

            // Get agent data from localStorage
            const storedAgentData = localStorage.getItem("agentData")

            if (!storedAgentData) {
                setError("No agent data found")
                setLoading(false)
                return
            }

            // Parse the stored data
            const parsedData = JSON.parse(storedAgentData)
            setAgent(parsedData)

            // If we have an agent ID, try to get fresh data from the server
            if (parsedData._id) {
                try {
                    // Use the existing endpoint that already constructs absolute URLs
                    const response = await axios.get(`/agent/${parsedData._id}`)

                    if (response.data.success) {
                        const freshData = response.data.data
                        setAgent(freshData)
                        // Update localStorage with fresh data
                        localStorage.setItem("agentData", JSON.stringify(freshData))
                    }
                } catch (apiError) {
                    console.error("Error fetching fresh agent data:", apiError)
                    // We already set the agent from localStorage, so we can continue
                }
            }
        } catch (err) {
            console.error("Error processing agent data:", err)
            setError("Failed to load agent data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAgentData()
    }, [])

    // Initialize form data when agent data changes or edit mode is enabled
    useEffect(() => {
        if (agent && editMode) {
            setFormData({
                companyName: agent.companyName || "",
                email: agent.email || "",
                website: agent.website || "",
                contactNumber: agent.contactNumber || "",
                headOfficeAddress: agent.headOfficeAddress || "",
                owners: agent.owners ? [...agent.owners] : [],
                branches: agent.branches ? [...agent.branches] : [],
            })

            // Reset profile picture preview when entering edit mode
            if (agent.profilePicture?.url) {
                setProfilePicturePreview(getAbsoluteUrl(agent.profilePicture.url))
            } else {
                setProfilePicturePreview(null)
            }
            setProfilePictureFile(null)
        }
    }, [agent, editMode])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleProfileClick = () => {
        setProfileOpen(true)
        handleClose()
    }

    const handleProfileClose = () => {
        setEditMode(false)
        setProfilePicturePreview(null)
        setProfilePictureFile(null)
        setProfileOpen(false)
    }

    const handleLogout = () => {
        // Clear all user data from localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("userAvatar")
        localStorage.removeItem("userType")
        localStorage.removeItem("agentData")

        // Update context if available
        if (setLoggedIn) setLoggedIn(false)
        if (setUserType) setUserType(null)

        // Redirect to login page
        window.location.href = "/agent-login"
    }

    // Helper function to ensure URLs are absolute
    const getAbsoluteUrl = (url) => {
        if (!url) return null

        // If it's already an absolute URL, return it
        if (url.startsWith("http")) return url

        // If it's a relative URL, prepend the base URL
        // Remove any leading slash from the URL to avoid double slashes
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url

        return `${API_BASE_URL}/${cleanUrl}`
    }

    // Format website URL for display and linking
    const formatWebsiteUrl = (website) => {
        if (!website) return null

        // If website doesn't start with http:// or https://, prepend https://
        if (!website.startsWith("http://") && !website.startsWith("https://")) {
            return `https://${website}`
        }

        return website
    }

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    // Handle owner field changes
    const handleOwnerChange = (index, value) => {
        setFormData((prevData) => {
            const updatedOwners = [...prevData.owners]
            updatedOwners[index] = { ...updatedOwners[index], name: value }
            return {
                ...prevData,
                owners: updatedOwners,
            }
        })
    }

    // Handle branch field changes
    const handleBranchChange = (index, value) => {
        setFormData((prevData) => {
            const updatedBranches = [...prevData.branches]
            updatedBranches[index] = { ...updatedBranches[index], address: value }
            return {
                ...prevData,
                branches: updatedBranches,
            }
        })
    }

    // Add a new owner
    const handleAddOwner = () => {
        setFormData((prevData) => ({
            ...prevData,
            owners: [...prevData.owners, { name: "" }],
        }))
    }

    // Add a new branch
    const handleAddBranch = () => {
        setFormData((prevData) => ({
            ...prevData,
            branches: [...prevData.branches, { address: "" }],
        }))
    }

    // Remove an owner
    const handleRemoveOwner = (index) => {
        setFormData((prevData) => {
            const updatedOwners = [...prevData.owners]
            updatedOwners.splice(index, 1)
            return {
                ...prevData,
                owners: updatedOwners,
            }
        })
    }

    // Remove a branch
    const handleRemoveBranch = (index) => {
        setFormData((prevData) => {
            const updatedBranches = [...prevData.branches]
            updatedBranches.splice(index, 1)
            return {
                ...prevData,
                branches: updatedBranches,
            }
        })
    }

    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check file type
            const validTypes = ["image/jpeg", "image/png", "image/jpg"]
            if (!validTypes.includes(file.type)) {
                setSnackbar({
                    open: true,
                    message: "Please select a valid image file (JPEG, PNG)",
                    severity: "error",
                })
                return
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSnackbar({
                    open: true,
                    message: "Image size should be less than 5MB",
                    severity: "error",
                })
                return
            }

            setProfilePictureFile(file)

            // Create a preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Trigger file input click
    const handleUploadClick = () => {
        fileInputRef.current.click()
    }

    // Toggle edit mode
    const toggleEditMode = () => {
        // Only enable edit mode if agent data is available
        if (!editMode && agent) {
            setFormData({
                companyName: agent.companyName || "",
                email: agent.email || "",
                website: agent.website || "",
                contactNumber: agent.contactNumber || "",
                headOfficeAddress: agent.headOfficeAddress || "",
                owners: agent.owners ? [...agent.owners] : [],
                branches: agent.branches ? [...agent.branches] : [],
            })

            // Set profile picture preview from agent data
            if (agent.profilePicture?.url) {
                setProfilePicturePreview(getAbsoluteUrl(agent.profilePicture.url))
            }
        }
        setEditMode(!editMode)
    }

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditMode(false)
        setProfilePicturePreview(null)
        setProfilePictureFile(null)
    }

    // Save changes
    const handleSaveChanges = async () => {
        try {
            setSaving(true)

            // Basic validation
            if (!formData.companyName || !formData.email) {
                setSnackbar({
                    open: true,
                    message: "Company name and email are required",
                    severity: "error",
                })
                setSaving(false)
                return
            }

            // First, update the text data using the update-info endpoint
            const textData = {
                companyName: formData.companyName,
                email: formData.email,
                website: formData.website || "",
                contactNumber: formData.contactNumber || "",
                headOfficeAddress: formData.headOfficeAddress || "",
                owners: formData.owners || [],
                branches: formData.branches || [],
            }

            console.log("Sending text data:", textData)

            // Update text information first
            const textResponse = await axios.put(`/agent/${agent._id}/update-info`, textData)

            if (!textResponse.data.success) {
                throw new Error(textResponse.data.message || "Failed to update profile information")
            }

            // If there's a new profile picture, upload it separately
            if (profilePictureFile) {
                const profileFormData = new FormData()
                profileFormData.append("profilePicture", profilePictureFile)

                const profileResponse = await axios.post(`/agent/${agent._id}/upload-profile`, profileFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })

                if (!profileResponse.data.success) {
                    throw new Error(profileResponse.data.message || "Failed to upload profile picture")
                }
            }

            // Get the updated agent data
            const response = await axios.get(`/agent/${agent._id}`)

            if (response.data.success) {
                // Update local state with response data
                const updatedAgent = response.data.data
                setAgent(updatedAgent)

                // Update localStorage
                localStorage.setItem("agentData", JSON.stringify(updatedAgent))

                // Close the dialog
                setProfileOpen(false)

                // Exit edit mode
                setEditMode(false)
                setProfilePictureFile(null)

                // Show success message
                setSnackbar({
                    open: true,
                    message: "Profile updated successfully",
                    severity: "success",
                })
            } else {
                throw new Error(response.data.message || "Failed to retrieve updated profile")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.message || "Failed to update profile",
                severity: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1 }}>
                <CircularProgress size={24} />
            </Box>
        )
    }

    if (error || !agent) {
        return (
            <Avatar
                sx={{
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    bgcolor: "primary.main",
                }}
                onClick={handleClick}
            >
                A
            </Avatar>
        )
    }

    // Get profile picture URL, ensuring it's absolute
    const profilePictureUrl = agent.profilePicture?.url ? getAbsoluteUrl(agent.profilePicture.url) : null

    return (
        <>
            <Avatar
                src={profilePictureUrl}
                alt={agent.companyName}
                onClick={handleClick}
                sx={{
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                }}
            >
                {agent.companyName ? agent.companyName.charAt(0).toUpperCase() : "A"}
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 280,
                        borderRadius: 2,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                        overflow: "visible",
                        mt: 1.5,
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                            src={profilePictureUrl}
                            alt={agent.companyName}
                            sx={{
                                width: 48,
                                height: 48,
                                border: "2px solid",
                                borderColor: "primary.main",
                            }}
                        >
                            {agent.companyName ? agent.companyName.charAt(0).toUpperCase() : "A"}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {agent.companyName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {agent.email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfileClick} sx={{ py: 1.2 }}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.2,
                        color: "error.main",
                        "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog
                open={profileOpen}
                onClose={handleProfileClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Agent Profile
                    {!editMode ? (
                        <Tooltip title="Edit Profile">
                            <IconButton onClick={toggleEditMode} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleProfilePictureChange}
                            />

                            {/* Profile picture with edit option */}
                            {editMode ? (
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    badgeContent={
                                        <Tooltip title="Upload Photo">
                                            <IconButton
                                                onClick={handleUploadClick}
                                                sx={{
                                                    bgcolor: "primary.main",
                                                    color: "white",
                                                    "&:hover": {
                                                        bgcolor: "primary.dark",
                                                    },
                                                    width: 36,
                                                    height: 36,
                                                    border: "2px solid white",
                                                }}
                                            >
                                                <PhotoCameraIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <Avatar
                                        src={profilePicturePreview || profilePictureUrl}
                                        alt="Profile Picture"
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            margin: "0 auto",
                                            border: "3px solid",
                                            borderColor: "primary.main",
                                        }}
                                    >
                                        {agent.companyName ? agent.companyName.charAt(0).toUpperCase() : "A"}
                                    </Avatar>
                                </Badge>
                            ) : (
                                <Avatar
                                    src={profilePictureUrl}
                                    alt="Profile Picture"
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        margin: "0 auto",
                                        border: "3px solid",
                                        borderColor: "primary.main",
                                    }}
                                >
                                    {agent.companyName ? agent.companyName.charAt(0).toUpperCase() : "A"}
                                </Avatar>
                            )}

                            {editMode ? (
                                <TextField
                                    name="companyName"
                                    label="Company Name"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    error={!formData.companyName}
                                    helperText={!formData.companyName ? "Company name is required" : ""}
                                />
                            ) : (
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {agent.companyName}
                                </Typography>
                            )}

                            {editMode ? (
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    error={!formData.email}
                                    helperText={!formData.email ? "Email is required" : ""}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    {agent.email}
                                </Typography>
                            )}

                            {profilePictureFile && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                    New image selected: {profilePictureFile.name}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                                Company Details
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <>
                                        <TextField
                                            name="website"
                                            label="Website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="normal"
                                            placeholder="e.g., example.com"
                                        />
                                        <TextField
                                            name="contactNumber"
                                            label="Contact Number"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="normal"
                                            placeholder="e.g., +1 234 567 8900"
                                        />
                                        <TextField
                                            name="headOfficeAddress"
                                            label="Head Office Address"
                                            value={formData.headOfficeAddress}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={2}
                                            placeholder="Enter full address"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body1">
                                            <strong>Website:</strong>{" "}
                                            {agent.website ? (
                                                <Link
                                                    href={formatWebsiteUrl(agent.website)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        textDecoration: "none",
                                                        color: "primary.main",
                                                        "&:hover": { textDecoration: "underline" },
                                                    }}
                                                >
                                                    {agent.website}
                                                </Link>
                                            ) : (
                                                "N/A"
                                            )}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Contact Number:</strong> {agent.contactNumber || "N/A"}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Head Office:</strong> {agent.headOfficeAddress || "N/A"}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="h6">Owners</Typography>
                                {editMode && (
                                    <Tooltip title="Add Owner">
                                        <IconButton onClick={handleAddOwner} color="primary" size="small">
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {editMode ? (
                                <Box sx={{ mb: 2 }}>
                                    {formData.owners && formData.owners.length > 0 ? (
                                        formData.owners.map((owner, index) => (
                                            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <TextField
                                                    value={owner.name || ""}
                                                    onChange={(e) => handleOwnerChange(index, e.target.value)}
                                                    fullWidth
                                                    margin="dense"
                                                    label={`Owner ${index + 1}`}
                                                    size="small"
                                                />
                                                <IconButton onClick={() => handleRemoveOwner(index)} color="error" size="small" sx={{ ml: 1 }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))
                                    ) : (
                                        <Button startIcon={<AddIcon />} onClick={handleAddOwner} variant="outlined" size="small">
                                            Add Owner
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                <>
                                    {agent.owners && agent.owners.length > 0 ? (
                                        agent.owners.length === 1 ? (
                                            <Typography variant="body1">{agent.owners[0].name || "N/A"}</Typography>
                                        ) : (
                                            <List component={Paper} variant="outlined" sx={{ mt: 1, mb: 2, borderRadius: 1 }}>
                                                {agent.owners.map((owner, index) => (
                                                    <ListItem key={index} sx={{ py: 1 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <BusinessIcon color="primary" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={owner.name || `Owner ${index + 1}`}
                                                            primaryTypographyProps={{
                                                                variant: "body2",
                                                                fontWeight: owner.name ? "normal" : "light",
                                                                fontStyle: owner.name ? "normal" : "italic",
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )
                                    ) : (
                                        <Typography variant="body1">No owner information available</Typography>
                                    )}
                                </>
                            )}

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="h6">Branches</Typography>
                                {editMode && (
                                    <Tooltip title="Add Branch">
                                        <IconButton onClick={handleAddBranch} color="primary" size="small">
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {editMode ? (
                                <Box>
                                    {formData.branches && formData.branches.length > 0 ? (
                                        formData.branches.map((branch, index) => (
                                            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <TextField
                                                    value={branch.address || ""}
                                                    onChange={(e) => handleBranchChange(index, e.target.value)}
                                                    fullWidth
                                                    margin="dense"
                                                    label={`Branch ${index + 1} Address`}
                                                    size="small"
                                                />
                                                <IconButton onClick={() => handleRemoveBranch(index)} color="error" size="small" sx={{ ml: 1 }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))
                                    ) : (
                                        <Button startIcon={<AddIcon />} onClick={handleAddBranch} variant="outlined" size="small">
                                            Add Branch
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                <>
                                    {agent.branches && agent.branches.length > 0 ? (
                                        <List component={Paper} variant="outlined" sx={{ mt: 1, borderRadius: 1 }}>
                                            {agent.branches.map((branch, index) => (
                                                <ListItem key={index} sx={{ py: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <LocationIcon color="primary" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={branch.address || "Branch " + (index + 1)}
                                                        primaryTypographyProps={{
                                                            variant: "body2",
                                                            fontWeight: branch.address ? "normal" : "light",
                                                            fontStyle: branch.address ? "normal" : "italic",
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body1">No branch information available</Typography>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {editMode ? (
                        <>
                            <Button onClick={handleCancelEdit} color="inherit">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                color="primary"
                                variant="contained"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} /> : null}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleProfileClose} color="primary">
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Use Portal to render the Snackbar outside the DOM hierarchy */}
            <div style={{ position: "fixed", zIndex: 9999, top: 0, left: 0, right: 0 }}>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    )
}

export default ProfileMenu
