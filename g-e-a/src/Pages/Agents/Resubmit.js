"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    IconButton,
    Paper,
    Grid,
    FormHelperText,
    Avatar,
    CircularProgress,
    Alert,
    Snackbar,
    Card,
    CardContent,
} from "@mui/material"
import { AddCircleOutline, RemoveCircleOutline, CloudUpload, CameraAlt, Delete, ArrowBack } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
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
        name: "ECAN Registration Certificate",
        required: true,
    },
    {
        id: "ownerCitizenship",
        name: "Owner's Citizenship",
        required: true,
    },
]

const AgentResubmit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
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
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [submissionStatus, setSubmissionStatus] = useState(null)
    const [agentData, setAgentData] = useState(null)
    const [loadError, setLoadError] = useState(null)
    const [debugInfo, setDebugInfo] = useState(null)

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

    // Fetch agent data
    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                setIsInitialLoading(true)
                const response = await axios.get(`http://localhost:3001/api/agent/${id}`)

                if (!response.data?.success) {
                    throw new Error("Failed to load agent data")
                }

                const agent = response.data.data
                setAgentData(agent)

                // Initialize form data with agent data
                setFormData({
                    companyName: agent.companyName || "",
                    owners: agent.owners?.length > 0 ? agent.owners : [{ name: "" }],
                    email: agent.email || "",
                    website: agent.website || "",
                    contactNumber: agent.contactNumber || "",
                    headOfficeAddress: agent.headOfficeAddress || "",
                    branches: agent.branches?.length > 0 ? agent.branches : [{ address: "" }],
                    documents: {
                        panVat: null,
                        companyRegistration: null,
                        icanRegistration: null,
                        ownerCitizenship: null,
                    },
                    profilePicture: null,
                })

                // Set document previews
                if (agent.documents) {
                    const previews = {}
                    Object.entries(agent.documents).forEach(([key, doc]) => {
                        if (doc && doc.url) {
                            previews[key] = doc.url.startsWith("http") ? doc.url : `http://localhost:3001${doc.url}`
                        }
                    })
                    setDocumentPreviews(previews)
                }

                // Set profile preview
                if (agent.profilePicture && agent.profilePicture.url) {
                    setProfilePreview(
                        agent.profilePicture.url.startsWith("http")
                            ? agent.profilePicture.url
                            : `http://localhost:3001${agent.profilePicture.url}`,
                    )
                }

                // Check if agent is rejected
                if (agent.status !== "rejected") {
                    showSnackbar("This agent is not currently rejected and cannot resubmit.", "warning")
                }
            } catch (error) {
                console.error("Error fetching agent data:", error)
                setLoadError(error.response?.data?.message || error.message || "Failed to load agent data")
                showSnackbar("Failed to load agent data. Please try again later.", "error")
            } finally {
                setIsInitialLoading(false)
            }
        }

        if (id) {
            fetchAgentData()
        }
    }, [id])

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
        // Don't reset the preview if we're using the existing profile picture
        if (!agentData?.profilePicture?.url || profilePreview !== `http://localhost:3001${agentData.profilePicture.url}`) {
            setProfilePreview(null)
        }
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

        // Don't reset the preview if we're using the existing document
        if (
            !agentData?.documents?.[documentType]?.url ||
            documentPreviews[documentType] !== `http://localhost:3001${agentData.documents[documentType].url}`
        ) {
            setDocumentPreviews({
                ...documentPreviews,
                [documentType]: null,
            })
        }

        showSnackbar(`${getDocumentName(documentType)} removed.`, "info")
    }

    const getDocumentName = (documentType) => {
        const doc = DOCUMENT_TYPES.find((d) => d.id === documentType)
        return doc ? doc.name : documentType
    }

    // Add this function after the getDocumentName function
    const validateNepalPhoneNumber = (phoneNumber) => {
        // Remove spaces, hyphens, and other non-digit characters except for the + sign
        const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "")

        // Regex patterns for different formats
        const patterns = {
            // Mobile numbers with country code: +977 followed by 98x (x=0-6) and 7 digits
            mobileWithCountryCode: /^\+977(98[0-6])\d{7}$/,

            // Mobile numbers without country code: 98x (x=0-6) and 7 digits
            mobileWithoutCountryCode: /^(98[0-6])\d{7}$/,

            // Landline with country code: +977 followed by area code and appropriate digits
            landlineWithCountryCode: /^\+977(01|0[2-9]1|057)\d{6,7}$/,

            // Landline without country code: area code followed by appropriate digits
            landlineWithoutCountryCode: /^(01|0[2-9]1|057)\d{6,7}$/,
        }

        // Check if the number matches any of the patterns
        return (
            patterns.mobileWithCountryCode.test(cleanedNumber) ||
            patterns.mobileWithoutCountryCode.test(cleanedNumber) ||
            patterns.landlineWithCountryCode.test(cleanedNumber) ||
            patterns.landlineWithoutCountryCode.test(cleanedNumber)
        )
    }

    // Update the validate function to include phone number validation
    const validate = () => {
        const newErrors = {}

        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"

        // Validate contact number
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required"
        } else if (!validateNepalPhoneNumber(formData.contactNumber)) {
            newErrors.contactNumber = "Please enter a valid Nepalese phone number"
        }

        if (!formData.headOfficeAddress.trim()) newErrors.headOfficeAddress = "Head office address is required"

        // We don't validate profile picture if there's already one in the preview
        if (!profilePreview) {
            if (!formData.profilePicture) {
                newErrors.profilePicture = "Profile picture is required"
            }
        }

        formData.owners.forEach((owner, index) => {
            if (!owner.name.trim()) newErrors[`owner_${index}`] = "Owner name is required"
        })

        // Validate required documents - only if there's no preview (existing document)
        DOCUMENT_TYPES.forEach((docType) => {
            if (docType.required && !documentPreviews[docType.id] && !formData.documents[docType.id]) {
                // If we have an existing preview, we don't need a new file
                if (!documentPreviews[docType.id]) {
                    newErrors[docType.id] = `${docType.name} is required`
                }
            }
        })

        setErrors(newErrors)

        // Show snackbar for validation errors
        if (Object.keys(newErrors).length > 0) {
            showSnackbar("Please fix the errors in the form before submitting.")
        }

        return Object.keys(newErrors).length === 0
    }

    // Function to try submitting without files first
    const submitWithoutFiles = async () => {
        try {
            // Create a simple JSON object with just the text data
            const jsonData = {
                companyName: formData.companyName,
                email: formData.email,
                website: formData.website || "",
                contactNumber: formData.contactNumber,
                headOfficeAddress: formData.headOfficeAddress,
                owners: formData.owners,
                branches: formData.branches,
                keepExistingFiles: true,
                skipFileUpload: true, // Tell the server not to expect files
            }

            console.log("Submitting JSON data without files:", jsonData)

            // Use axios with your backend API
            const response = await axios.put(`http://localhost:3001/api/agent/${id}/update-info`, jsonData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            console.log("Text-only submission successful:", response.data)
            return true
        } catch (error) {
            console.error("Text-only submission error:", error)

            // Extract and log detailed error information
            if (error.response) {
                console.log("Error status:", error.response.status)
                console.log("Error headers:", error.response.headers)
                console.log("Error data:", error.response.data)
            } else if (error.request) {
                console.log("No response received:", error.request)
            } else {
                console.log("Error setting up request:", error.message)
            }

            return false
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        setSubmissionStatus(null)
        setDebugInfo(null)

        try {
            // First try the text-only update to see if basic connectivity works
            const textUpdateSuccess = await submitWithoutFiles()
            console.log("Text-only update result:", textUpdateSuccess)

            // If we have files to upload, use a different approach
            const hasFilesToUpload = formData.profilePicture || Object.values(formData.documents).some((doc) => doc !== null)

            if (hasFilesToUpload) {
                // Create a simpler FormData object with minimal fields
                const simpleFormData = new FormData()

                // Add only the essential text fields
                simpleFormData.append("companyName", formData.companyName)
                simpleFormData.append("email", formData.email)
                simpleFormData.append("keepExistingFiles", "true")

                // Add profile picture if it exists
                if (formData.profilePicture && formData.profilePicture instanceof File) {
                    console.log("Adding profile picture to form:", formData.profilePicture.name, formData.profilePicture.size)
                    simpleFormData.append("profilePicture", formData.profilePicture)
                }

                // Try to upload just the profile picture first
                try {
                    const profileResponse = await axios({
                        method: "post",
                        url: `http://localhost:3001/api/agent/${id}/upload-profile`,
                        data: simpleFormData,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    console.log("Profile picture upload successful:", profileResponse.data)
                } catch (profileError) {
                    console.error("Profile picture upload failed:", profileError)
                    setDebugInfo({
                        profileError: profileError.response?.data || profileError.message,
                    })
                }

                // Now try to upload each document separately
                for (const [docType, file] of Object.entries(formData.documents)) {
                    if (file && file instanceof File) {
                        const docFormData = new FormData()
                        docFormData.append("documentType", docType)
                        docFormData.append("document", file)

                        try {
                            console.log(`Uploading document ${docType}:`, file.name, file.size)
                            const docResponse = await axios({
                                method: "post",
                                url: `http://localhost:3001/api/agent/${id}/upload-document`,
                                data: docFormData,
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            console.log(`Document ${docType} upload successful:`, docResponse.data)
                        } catch (docError) {
                            console.error(`Document ${docType} upload failed:`, docError)
                        }
                    }
                }
            }

            setSubmissionStatus({
                type: "success",
                message: "Your information has been resubmitted successfully!",
            })

            showSnackbar(
                "Your information has been resubmitted successfully! Your application will be reviewed again.",
                "success",
            )

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate("/agent-login")
            }, 3000)
        } catch (error) {
            console.error("Resubmission error:", error)

            // Extract and display detailed error information
            let errorMessage = "Resubmission failed. Please try again."
            let debugData = {}

            if (error.response) {
                console.log("Error status:", error.response.status)
                console.log("Error headers:", error.response.headers)
                console.log("Error data:", error.response.data)

                errorMessage = error.response.data.error || error.response.data.message || errorMessage
                debugData = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    headers: Object.fromEntries(Object.entries(error.response.headers)),
                }
            } else if (error.request) {
                console.log("No response received:", error.request)
                errorMessage = "No response received from server. Please check your connection."
                debugData = {
                    request: "Request was made but no response was received",
                    method: error.config?.method,
                    url: error.config?.url,
                }
            } else {
                console.log("Error setting up request:", error.message)
                errorMessage = error.message || errorMessage
                debugData = {
                    message: error.message,
                    stack: error.stack,
                }
            }

            setSubmissionStatus({
                type: "error",
                message: errorMessage,
            })

            setDebugInfo(debugData)
            showSnackbar(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isInitialLoading) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}
            >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading agent data...</Typography>
            </Container>
        )
    }

    if (loadError) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {loadError}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/agent-login")}
                    sx={{ bgcolor: BRAND_COLOR, "&:hover": { bgcolor: "#4338ca" } }}
                >
                    Back to Login
                </Button>
            </Container>
        )
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
                        mb: 2,
                    }}
                >
                    Update Your Agent Application
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
                    Your previous application was rejected. Please update your information and resubmit.
                </Typography>

                {agentData?.remarks && (
                    <Box
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: 1,
                            backgroundColor: "rgba(79, 70, 229, 0.1)",
                            border: "1px solid rgba(79, 70, 229, 0.3)",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Box
                                component="span"
                                sx={{
                                    display: "inline-flex",
                                    mr: 1,
                                    color: BRAND_COLOR,
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold" color={BRAND_COLOR}>
                                Reason for rejection:
                            </Typography>
                        </Box>
                        <Typography sx={{ pl: 4 }}>{agentData.remarks}</Typography>
                    </Box>
                )}

                {submissionStatus && (
                    <Alert severity={submissionStatus.type} sx={{ mb: 3 }}>
                        {submissionStatus.message}
                    </Alert>
                )}

                {/* Debug Information */}
                {debugInfo && (
                    <Box sx={{ mb: 3, mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="error">
                            Debug Information:
                        </Typography>
                        <Box
                            component="pre"
                            sx={{
                                p: 2,
                                bgcolor: "#f5f5f5",
                                borderRadius: 1,
                                overflow: "auto",
                                fontSize: "0.75rem",
                                maxHeight: "200px",
                            }}
                        >
                            {JSON.stringify(debugInfo, null, 2)}
                        </Box>
                    </Box>
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
                                    {profilePreview ? "Change" : "Upload"}
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
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={true} // Email cannot be changed
                                helperText="Email cannot be changed"
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
                                helperText={errors.contactNumber || "Valid formats: 98x-xxxxxxx, 0xx-xxxxxx, +977 98x-xxxxxxx"}
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
                            {isLoading ? <CircularProgress size={24} /> : "Resubmit Application"}
                        </PrimaryButton>
                    </Box>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="body2" sx={{ display: "inline", mr: 1 }}>
                            Return to
                        </Typography>
                        <NavLink to="/agent-login" style={{ color: BRAND_COLOR, fontWeight: "bold" }}>
                            Login
                        </NavLink>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}

export default AgentResubmit
