import { useState } from "react"
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    IconButton,
    Paper,
    Link,
    Grid,
    FormHelperText,
    Avatar,
    CircularProgress,
    Alert,
    Snackbar,
    Card,
    CardContent,
    InputAdornment,
} from "@mui/material"
import {
    AddCircleOutline,
    RemoveCircleOutline,
    CloudUpload,
    CameraAlt,
    Delete,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { NavLink } from "react-router-dom"

// Brand color
const BRAND_COLOR = "#4f46e5"

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: BRAND_COLOR,
    "&:hover": {
        backgroundColor: "#4338ca",
    },
}))

// Custom styled Alert for brand colors
const BrandAlert = styled(Alert)(({ theme, severity }) => ({
    ...(severity === "error" && {
        backgroundColor: BRAND_COLOR,
        color: "#fff",
    }),
    ...(severity === "info" && {
        backgroundColor: BRAND_COLOR,
        color: "#fff",
    }),
}))

// Required field marker
const RequiredMark = () => <span style={{ color: "red", marginLeft: "2px" }}>*</span>

// Define document types
const DOCUMENT_TYPES = [
    {
        id: "panVat",
        name: "PAN/VAT Registration Document",
        required: true,
    },
    {
        id: "companyRegistration",
        name: "Company Registration Certificate",
        required: true,
    },
    {
        id: "icanRegistration",
        name: "ECAN Registration Certificate", // Changed from ICAN to ECAN
        required: true,
    },
    {
        id: "ownerCitizenship",
        name: "Owner's Citizenship",
        required: true,
    },
]

const AgentRegistration = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        owners: [{ name: "" }],
        email: "",
        website: "",
        contactNumber: "",
        headOfficeAddress: "",
        branches: [{ address: "" }],
        documents: {
            panVat: null,
            companyRegistration: null,
            icanRegistration: null,
            ownerCitizenship: null,
        },
        profilePicture: null,
    })

    const [errors, setErrors] = useState({})
    const [documentPreviews, setDocumentPreviews] = useState({
        panVat: null,
        companyRegistration: null,
        icanRegistration: null,
        ownerCitizenship: null,
    })
    const [profilePreview, setProfilePreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState(null)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error",
    })

    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false,
        })
    }

    const showSnackbar = (message, severity = "error") => {
        setSnackbar({
            open: true,
            message,
            severity,
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleOwnerChange = (index, e) => {
        const newOwners = [...formData.owners]
        newOwners[index].name = e.target.value
        setFormData({
            ...formData,
            owners: newOwners,
        })
    }

    const handleBranchChange = (index, e) => {
        const newBranches = [...formData.branches]
        newBranches[index].address = e.target.value
        setFormData({
            ...formData,
            branches: newBranches,
        })
    }

    const addOwner = () => {
        setFormData({
            ...formData,
            owners: [...formData.owners, { name: "" }],
        })
    }

    const removeOwner = (index) => {
        const newOwners = [...formData.owners]
        newOwners.splice(index, 1)
        setFormData({
            ...formData,
            owners: newOwners,
        })
    }

    const addBranch = () => {
        setFormData({
            ...formData,
            branches: [...formData.branches, { address: "" }],
        })
    }

    const removeBranch = (index) => {
        const newBranches = [...formData.branches]
        newBranches.splice(index, 1)
        setFormData({
            ...formData,
            branches: newBranches,
        })
    }

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Check file type
        if (!file.type.match("image/jpeg|image/png")) {
            setErrors({
                ...errors,
                profilePicture: "Only JPG and PNG images are allowed",
            })
            showSnackbar("Invalid profile picture format. Only JPG and PNG are allowed.")
            return
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            setErrors({
                ...errors,
                profilePicture: "File size must be less than 5MB",
            })
            showSnackbar("Profile picture size exceeds 5MB limit.")
            return
        }

        setFormData({
            ...formData,
            profilePicture: file,
        })

        const reader = new FileReader()
        reader.onload = (e) => {
            setProfilePreview(e.target.result)
        }
        reader.readAsDataURL(file)

        if (errors.profilePicture) {
            setErrors({
                ...errors,
                profilePicture: null,
            })
        }
    }

    const removeProfilePicture = () => {
        setFormData({
            ...formData,
            profilePicture: null,
        })
        setProfilePreview(null)
    }

    const handleDocumentUpload = (e, documentType) => {
        const file = e.target.files[0]
        if (!file) return

        // Check file type
        if (!file.type.match("image/jpeg|image/png")) {
            setErrors({
                ...errors,
                [documentType]: "Only JPG and PNG images are allowed",
            })
            showSnackbar(`Invalid file format for ${getDocumentName(documentType)}. Only JPG and PNG are allowed.`)
            return
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            setErrors({
                ...errors,
                [documentType]: "File size must be less than 5MB",
            })
            showSnackbar(`File size exceeds 5MB limit for ${getDocumentName(documentType)}.`)
            return
        }

        // Update the documents object with the new file
        setFormData({
            ...formData,
            documents: {
                ...formData.documents,
                [documentType]: file,
            },
        })

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setDocumentPreviews({
                ...documentPreviews,
                [documentType]: e.target.result,
            })
        }
        reader.readAsDataURL(file)

        // Clear any errors for this document type
        if (errors[documentType]) {
            setErrors({
                ...errors,
                [documentType]: null,
            })
        }

        showSnackbar(`${getDocumentName(documentType)} uploaded successfully.`, "success")
    }

    const removeDocument = (documentType) => {
        // Update the documents object to remove the file
        setFormData({
            ...formData,
            documents: {
                ...formData.documents,
                [documentType]: null,
            },
        })

        // Remove the preview
        setDocumentPreviews({
            ...documentPreviews,
            [documentType]: null,
        })

        showSnackbar(`${getDocumentName(documentType)} removed.`, "info")
    }

    const getDocumentName = (documentType) => {
        const doc = DOCUMENT_TYPES.find((d) => d.id === documentType)
        return doc ? doc.name : documentType
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid"
        if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
        if (!formData.headOfficeAddress.trim()) newErrors.headOfficeAddress = "Head office address is required"
        if (!formData.profilePicture) newErrors.profilePicture = "Profile picture is required"
        if (!password) newErrors.password = "Password is required"
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters"
        if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
        else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"

        formData.owners.forEach((owner, index) => {
            if (!owner.name.trim()) newErrors[`owner_${index}`] = "Owner name is required"
        })

        // Validate required documents
        DOCUMENT_TYPES.forEach((docType) => {
            if (docType.required && !formData.documents[docType.id]) {
                newErrors[docType.id] = `${docType.name} is required`
            }
        })

        setErrors(newErrors)

        // Show snackbar for validation errors
        if (Object.keys(newErrors).length > 0) {
            showSnackbar("Please fix the errors in the form before submitting.")
        }

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        setSubmissionStatus(null)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append("companyName", formData.companyName)
            formDataToSend.append("email", formData.email)
            formDataToSend.append("website", formData.website || "")
            formDataToSend.append("contactNumber", formData.contactNumber)
            formDataToSend.append("headOfficeAddress", formData.headOfficeAddress)
            formDataToSend.append("owners", JSON.stringify(formData.owners))
            formDataToSend.append("branches", JSON.stringify(formData.branches))
            formDataToSend.append("password", password)

            if (formData.profilePicture) {
                formDataToSend.append("profilePicture", formData.profilePicture)
            }

            // Append each document with its specific field name
            Object.entries(formData.documents).forEach(([key, file]) => {
                if (file) {
                    formDataToSend.append(key, file)
                }
            })

            const response = await axios.post("http://localhost:3001/api/createAgent", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            setSubmissionStatus({
                type: "success",
                message: "Registration submitted successfully!",
            })

            showSnackbar("Registration submitted successfully!", "success")

            // Reset form
            setFormData({
                companyName: "",
                owners: [{ name: "" }],
                email: "",
                website: "",
                contactNumber: "",
                headOfficeAddress: "",
                branches: [{ address: "" }],
                documents: {
                    panVat: null,
                    companyRegistration: null,
                    icanRegistration: null,
                    ownerCitizenship: null,
                },
                profilePicture: null,
            })
            setDocumentPreviews({
                panVat: null,
                companyRegistration: null,
                icanRegistration: null,
                ownerCitizenship: null,
            })
            setProfilePreview(null)
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            console.error("Registration error:", error)

            // Extract error message from response
            const errorMessage = error.response?.data?.error || "Registration failed. Please try again."

            setSubmissionStatus({
                type: "error",
                message: errorMessage,
            })

            showSnackbar(errorMessage)

            // Handle specific error cases
            if (errorMessage.includes("file type")) {
                showSnackbar("Invalid file type detected. Only JPG and PNG are allowed.")
            } else if (errorMessage.includes("file size")) {
                showSnackbar("One or more files exceed the 5MB size limit.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <BrandAlert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                    variant="filled"
                    elevation={6}
                >
                    {snackbar.message}
                </BrandAlert>
            </Snackbar>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: "center",
                        color: BRAND_COLOR,
                        fontWeight: "bold",
                        mb: 4,
                    }}
                >
                    Agent Registration
                </Typography>

                {submissionStatus && (
                    <Alert severity={submissionStatus.type} sx={{ mb: 3 }}>
                        {submissionStatus.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Profile Picture - Centered */}
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: BRAND_COLOR, textAlign: "center" }}>
                        Profile Picture <RequiredMark />
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                        <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="profile-upload"
                            type="file"
                            onChange={handleProfilePictureUpload}
                        />
                        <label htmlFor="profile-upload">
                            <IconButton color="primary" component="span" sx={{ p: 0 }}>
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: "#f0f0f0",
                                        color: "#757575",
                                    }}
                                    src={profilePreview}
                                >
                                    <CameraAlt sx={{ fontSize: 40 }} />
                                </Avatar>
                            </IconButton>
                        </label>
                        <Typography variant="body1" sx={{ mt: 2, mb: 1, textAlign: "center" }}>
                            Upload company logo/profile picture
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <label htmlFor="profile-upload">
                                <Button variant="outlined" component="span" size="small" sx={{ textTransform: "uppercase" }}>
                                    Upload
                                </Button>
                            </label>
                            {profilePreview && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={removeProfilePicture}
                                    sx={{ textTransform: "uppercase" }}
                                >
                                    Remove
                                </Button>
                            )}
                        </Box>
                        {errors.profilePicture && (
                            <FormHelperText error sx={{ textAlign: "center" }}>
                                {errors.profilePicture}
                            </FormHelperText>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                            Accepted formats: JPG, PNG. Max size: 5MB
                        </Typography>
                    </Box>

                    {/* Company Information */}
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: BRAND_COLOR }}>
                        Company Information
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Company Name <RequiredMark />
                                    </span>
                                }
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                error={!!errors.companyName}
                                helperText={errors.companyName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Email Address <RequiredMark />
                                    </span>
                                }
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Contact Number <RequiredMark />
                                    </span>
                                }
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                error={!!errors.contactNumber}
                                helperText={errors.contactNumber}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Password <RequiredMark />
                                    </span>
                                }
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Confirm Password <RequiredMark />
                                    </span>
                                }
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Website URL"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Company Owners */}
                    <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 2, color: BRAND_COLOR }}>
                        Company Owners
                    </Typography>
                    {formData.owners.map((owner, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TextField
                                fullWidth
                                label={
                                    <span>
                                        Owner {index + 1} Name <RequiredMark />
                                    </span>
                                }
                                value={owner.name}
                                onChange={(e) => handleOwnerChange(index, e)}
                                error={!!errors[`owner_${index}`]}
                                helperText={errors[`owner_${index}`]}
                            />
                            {formData.owners.length > 1 && (
                                <IconButton onClick={() => removeOwner(index)} color="error" sx={{ ml: 1 }}>
                                    <RemoveCircleOutline />
                                </IconButton>
                            )}
                            {index === formData.owners.length - 1 && (
                                <IconButton onClick={addOwner} color="primary" sx={{ ml: 1 }}>
                                    <AddCircleOutline />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Address Information */}
                    <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 2, color: BRAND_COLOR }}>
                        Address Information
                    </Typography>
                    <TextField
                        fullWidth
                        label={
                            <span>
                                Head Office Address <RequiredMark />
                            </span>
                        }
                        name="headOfficeAddress"
                        value={formData.headOfficeAddress}
                        onChange={handleChange}
                        error={!!errors.headOfficeAddress}
                        helperText={errors.headOfficeAddress}
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                    />

                    {/* Company Branches */}
                    <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 2, color: BRAND_COLOR }}>
                        Company Branches
                    </Typography>
                    {formData.branches.map((branch, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TextField
                                fullWidth
                                label={`Branch ${index + 1} Address`}
                                value={branch.address}
                                onChange={(e) => handleBranchChange(index, e)}
                                multiline
                                rows={2}
                            />
                            {formData.branches.length > 1 && (
                                <IconButton onClick={() => removeBranch(index)} color="error" sx={{ ml: 1 }}>
                                    <RemoveCircleOutline />
                                </IconButton>
                            )}
                            {index === formData.branches.length - 1 && (
                                <IconButton onClick={addBranch} color="primary" sx={{ ml: 1 }}>
                                    <AddCircleOutline />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Registration Documents */}
                    <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 3, color: BRAND_COLOR }}>
                        Registration Documents
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                        Please upload the following required documents. Accepted formats: JPG, PNG. Max size: 5MB per file.
                    </Typography>

                    <Grid container spacing={3}>
                        {DOCUMENT_TYPES.map((docType) => (
                            <Grid item xs={12} md={6} key={docType.id}>
                                <Card variant="outlined" sx={{ height: "100%" }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            {docType.name} {docType.required && <RequiredMark />}
                                        </Typography>

                                        {documentPreviews[docType.id] ? (
                                            <Box sx={{ position: "relative", mb: 2 }}>
                                                <img
                                                    src={documentPreviews[docType.id] || "/placeholder.svg"}
                                                    alt={docType.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "140px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => removeDocument(docType.id)}
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                        },
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: "140px",
                                                    border: "1px dashed #ccc",
                                                    borderRadius: "4px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mb: 2,
                                                    bgcolor: "#f9f9f9",
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" align="center">
                                                    No file uploaded
                                                </Typography>
                                            </Box>
                                        )}

                                        <input
                                            accept="image/jpeg,image/png"
                                            style={{ display: "none" }}
                                            id={`document-upload-${docType.id}`}
                                            type="file"
                                            onChange={(e) => handleDocumentUpload(e, docType.id)}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <label htmlFor={`document-upload-${docType.id}`}>
                                                <Button variant="outlined" component="span" startIcon={<CloudUpload />} size="small" fullWidth>
                                                    {documentPreviews[docType.id] ? "Replace" : "Upload"}
                                                </Button>
                                            </label>
                                        </Box>
                                        {errors[docType.id] && (
                                            <FormHelperText error sx={{ textAlign: "center", mt: 1 }}>
                                                {errors[docType.id]}
                                            </FormHelperText>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Submit Button */}
                    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                        <PrimaryButton type="submit" variant="contained" size="large" sx={{ px: 6 }} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Register"}
                        </PrimaryButton>
                    </Box>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="body2" sx={{ display: "inline", mr: 1 }}>
                            Already have an account?
                        </Typography>
                        <NavLink to="/agent-login" underline="hover" sx={{ color: BRAND_COLOR, fontWeight: "bold" }}>
                            Login
                        </NavLink>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}

export default AgentRegistration
