import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../Context/context"
import axios from "axios"
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Divider,
    Stack,
    Paper,
    IconButton,
    Tooltip,
    InputAdornment,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import CancelIcon from "@mui/icons-material/Cancel"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import LockIcon from "@mui/icons-material/Lock"
import Loading from "../components/Loading"

// Brand color
const brandColor = "#4f46e5"

// Styled components
const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
})

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    backgroundColor: brandColor,
    color: theme.palette.getContrastText(brandColor),
    fontSize: "3rem",
    fontWeight: "bold",
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[4],
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "scale(1.05)",
    },
}))

const ProfileCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: theme.shadows[3],
    overflow: "visible",
    position: "relative",
    border: "none",
    background: theme.palette.background.paper,
}))

const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    marginBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(-8),
}))

const UploadButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: brandColor,
    color: theme.palette.getContrastText(brandColor),
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
    "& .MuiSvgIcon-root": {
        fontSize: "1.5rem",
    },
}))

const EditButton = styled(Button)(({ theme }) => ({
    backgroundColor: brandColor,
    color: "#ffffff",
    borderRadius: 8,
    padding: "10px 24px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    boxShadow: theme.shadows[1],
    textTransform: "none",
    "&:hover": {
        backgroundColor: "#4338ca",
        boxShadow: theme.shadows[2],
    },
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: brandColor,
    color: "#ffffff",
    fontWeight: 600,
    borderRadius: 8,
    padding: "12px 28px",
    boxShadow: theme.shadows[1],
    textTransform: "none",
    "&:hover": {
        backgroundColor: "#4338ca",
        boxShadow: theme.shadows[2],
    },
    "&.Mui-disabled": {
        backgroundColor: "#c7d2fe",
    },
}))

const InfoItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 0.2s ease",
    "&:hover": {
        borderColor: brandColor,
        boxShadow: theme.shadows[1],
    },
}))

const InfoLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
    marginBottom: theme.spacing(1),
    textTransform: "uppercase",
    letterSpacing: "0.5px",
}))

const InfoValue = styled(Typography)(({ theme }) => ({
    fontSize: "1.125rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
}))

const PageTitle = styled(Typography)(({ theme }) => ({
    color: brandColor,
    fontWeight: 700,
    fontSize: "2rem",
    marginBottom: theme.spacing(1),
}))

const PageSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "1rem",
}))

const HeaderContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(6),
    paddingBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
}))

const ChangePasswordButton = styled(Button)(({ theme }) => ({
    color: brandColor,
    borderColor: brandColor,
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 500,
    "&:hover": {
        backgroundColor: "#eef2ff",
        borderColor: brandColor,
    },
}))

const Profile = () => {
    const { UserAvatar, setUserAvatar } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
    })
    const [profilePicture, setProfilePicture] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Form validation states
    const [firstNameError, setFirstNameError] = useState(false)
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("")
    const [lastNameError, setLastNameError] = useState(false)
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState("")
    const [contactNumberError, setContactNumberError] = useState(false)
    const [contactNumberErrorMessage, setContactNumberErrorMessage] = useState("")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")

    // Alert states
    const [alertMessage, setAlertMessage] = useState("")
    const [alertSeverity, setAlertSeverity] = useState(null)

    const fetchUserProfile = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:3001/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const { data } = response.data
            setProfileData({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactNumber: data.contactNumber || "",
            })

            if (data.profilePicture) {
                setPreviewUrl(data.profilePicture)
            }

            setUserAvatar(data.firstName)
        } catch (error) {
            console.error("Error fetching profile:", error)
            setAlertMessage(error.response?.data?.message || "Failed to load profile data")
            setAlertSeverity("error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage("")
                setAlertSeverity(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [alertMessage])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfileData({
            ...profileData,
            [name]: value,
        })
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData({
            ...passwordData,
            [name]: value,
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setAlertMessage("File size exceeds 5MB limit")
                setAlertSeverity("error")
                return
            }

            if (!file.type.startsWith("image/")) {
                setAlertMessage("Only image files are allowed")
                setAlertSeverity("error")
                return
            }

            setProfilePicture(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const validateInputs = () => {
        let isValid = true

        if (!profileData.firstName.trim()) {
            setFirstNameError(true)
            setFirstNameErrorMessage("First name is required")
            isValid = false
        } else {
            setFirstNameError(false)
            setFirstNameErrorMessage("")
        }

        if (!profileData.lastName.trim()) {
            setLastNameError(true)
            setLastNameErrorMessage("Last name is required")
            isValid = false
        } else {
            setLastNameError(false)
            setLastNameErrorMessage("")
        }

        if (profileData.contactNumber && !/^\+?[0-9\s-]{10,15}$/.test(profileData.contactNumber)) {
            setContactNumberError(true)
            setContactNumberErrorMessage("Please enter a valid contact number")
            isValid = false
        } else {
            setContactNumberError(false)
            setContactNumberErrorMessage("")
        }

        if (changePassword) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/
            if (!passwordData.currentPassword) {
                setPasswordError(true)
                setPasswordErrorMessage("Current password is required")
                isValid = false
            } else if (!passwordData.newPassword || !passwordRegex.test(passwordData.newPassword)) {
                setPasswordError(true)
                setPasswordErrorMessage(
                    "New password must be at least 8 characters long, contain one uppercase letter and one special character"
                )
                isValid = false
            } else if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError(true)
                setPasswordErrorMessage("Passwords do not match")
                isValid = false
            } else {
                setPasswordError(false)
                setPasswordErrorMessage("")
            }
        }

        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateInputs()) {
            return
        }

        setSaving(true)

        try {
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append("firstName", profileData.firstName)
            formData.append("lastName", profileData.lastName)
            formData.append("contactNumber", profileData.contactNumber)

            if (profilePicture) {
                formData.append("profilePicture", profilePicture)
            }

            // Update profile
            const profileResponse = await axios.put("http://localhost:3001/api/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            })

            // Update password if requested
            if (changePassword) {
                try {
                    const passwordResponse = await axios.put(
                        "http://localhost:3001/api/auth/password",
                        {
                            currentPassword: passwordData.currentPassword,
                            newPassword: passwordData.newPassword,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    setAlertMessage(passwordResponse.data.message || "Password updated successfully")
                    setAlertSeverity("success")
                } catch (passwordError) {
                    const errorMessage = passwordError.response?.data?.message || "Failed to update password"
                    if (passwordError.response?.status === 400 && errorMessage.includes("Current password")) {
                        setPasswordError(true)
                        setPasswordErrorMessage(errorMessage)
                    } else {
                        setAlertMessage(`Error: ${errorMessage}`)
                        setAlertSeverity("error")
                    }
                    setSaving(false)
                    return
                }
            }

            // Update preview URL if a new image was uploaded
            if (profileResponse.data.data.profilePicture) {
                setPreviewUrl(
                    profileResponse.data.data.profilePicture.startsWith("http")
                        ? profileResponse.data.data.profilePicture
                        : `${window.location.origin}${profileResponse.data.data.profilePicture}`
                )
            }

            // Update profile data
            setProfileData((prev) => ({
                ...prev,
                firstName: profileResponse.data.data.firstName,
                lastName: profileResponse.data.data.lastName,
                contactNumber: profileResponse.data.data.contactNumber || "",
            }))

            // Reset password fields
            if (changePassword) {
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
                setChangePassword(false)
            }

            setAlertMessage(profileResponse.data.message || "Profile updated successfully")
            setAlertSeverity("success")
            setUserAvatar(profileResponse.data.data.firstName)
            setEditMode(false)
        } catch (error) {
            console.error("Error updating profile:", error)
            const errorMessage = error.response?.data?.message || "Failed to update profile"
            setAlertMessage(`Error: ${errorMessage}`)
            setAlertSeverity("error")
        } finally {
            setSaving(false)
        }
    }

    const toggleEditMode = () => {
        setEditMode(!editMode)
        setChangePassword(false)
        setPasswordError(false)
        setPasswordErrorMessage("")
    }

    const cancelEdit = () => {
        fetchUserProfile()
        setProfilePicture(null)
        setEditMode(false)
        setChangePassword(false)
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
    }

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword)
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleChangePasswordClick = () => {
        setChangePassword(!changePassword)
        setPasswordError(false)
        setPasswordErrorMessage("")
    }

    if (loading) {
        return <Loading />
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <HeaderContainer>
                <Box>
                    <PageTitle variant="h1">Profile Settings</PageTitle>
                    <PageSubtitle variant="body1">
                        {editMode ? "Update your personal information" : "View and manage your profile details"}
                    </PageSubtitle>
                </Box>
                {!editMode ? (
                    <EditButton variant="contained" startIcon={<EditIcon />} onClick={toggleEditMode}>
                        Edit Profile
                    </EditButton>
                ) : (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={cancelEdit}
                        sx={{ borderRadius: 2 }}
                    >
                        Discard Changes
                    </Button>
                )}
            </HeaderContainer>

            {alertMessage && (
                <Stack sx={{ width: "100%", mb: 4 }} spacing={2}>
                    <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>
                        {alertMessage}
                    </Alert>
                </Stack>
            )}

            <ProfileCard elevation={3}>
                <CardContent sx={{ p: 6, pt: 10 }}>
                    {editMode ? (
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <AvatarWrapper>
                                <ProfileAvatar src={previewUrl || "/placeholder.svg?height=150&width=150"} alt={profileData.firstName}>
                                    {!previewUrl && profileData.firstName?.charAt(0)}
                                    {!previewUrl && profileData.lastName?.charAt(0)}
                                </ProfileAvatar>
                                <Tooltip title="Change profile picture">
                                    <span>
                                        <UploadButton component="label" aria-label="upload picture">
                                            <PhotoCameraIcon />
                                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                                        </UploadButton>
                                    </span>
                                </Tooltip>
                            </AvatarWrapper>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        error={firstNameError}
                                        helperText={firstNameErrorMessage}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        error={lastNameError}
                                        helperText={lastNameErrorMessage}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        variant="outlined"
                                        helperText="Email cannot be changed"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={profileData.contactNumber}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        placeholder="+1 (123) 456-7890"
                                        error={contactNumberError}
                                        helperText={contactNumberErrorMessage}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                {!changePassword ? (
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end">
                                            <ChangePasswordButton
                                                variant="outlined"
                                                startIcon={<LockIcon />}
                                                onClick={handleChangePasswordClick}
                                            >
                                                Change Password
                                            </ChangePasswordButton>
                                        </Box>
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="h6" color={brandColor} gutterBottom>
                                                Change Password
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Current Password"
                                                name="currentPassword"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                error={passwordError}
                                                helperText={passwordErrorMessage}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle current password visibility"
                                                                onClick={toggleCurrentPasswordVisibility}
                                                                edge="end"
                                                            >
                                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                name="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                error={passwordError}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle new password visibility"
                                                                onClick={toggleNewPasswordVisibility}
                                                                edge="end"
                                                            >
                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                error={passwordError}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle confirm password visibility"
                                                                onClick={toggleConfirmPasswordVisibility}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    onClick={handleChangePasswordClick}
                                                    sx={{ textTransform: "none" }}
                                                >
                                                    Cancel Password Change
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 4 }} />
                                    <Box display="flex" justifyContent="flex-end">
                                        <PrimaryButton
                                            type="submit"
                                            variant="contained"
                                            disabled={saving}
                                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                            sx={{ minWidth: 150 }}
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </PrimaryButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box>
                            <AvatarWrapper>
                                <ProfileAvatar src={previewUrl || "/placeholder.svg?height=150&width=150"} alt={profileData.firstName}>
                                    {!previewUrl && profileData.firstName?.charAt(0)}
                                    {!previewUrl && profileData.lastName?.charAt(0)}
                                </ProfileAvatar>
                            </AvatarWrapper>

                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <InfoItem elevation={0}>
                                        <InfoLabel>First Name</InfoLabel>
                                        <InfoValue>{profileData.firstName || "Not provided"}</InfoValue>
                                    </InfoItem>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InfoItem elevation={0}>
                                        <InfoLabel>Last Name</InfoLabel>
                                        <InfoValue>{profileData.lastName || "Not provided"}</InfoValue>
                                    </InfoItem>
                                </Grid>

                                <Grid item xs={12}>
                                    <InfoItem elevation={0}>
                                        <InfoLabel>Email</InfoLabel>
                                        <InfoValue>{profileData.email}</InfoValue>
                                    </InfoItem>
                                </Grid>

                                <Grid item xs={12}>
                                    <InfoItem elevation={0}>
                                        <InfoLabel>Contact Number</InfoLabel>
                                        <InfoValue>{profileData.contactNumber || "Not provided"}</InfoValue>
                                    </InfoItem>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </ProfileCard>
        </Container>
    )
}

export default Profile