import React, { useState, useEffect, useRef } from "react"
import {
    Tabs,
    Tab,
    Button,
    IconButton,
    Box,
    Card,
    CardContent,
    Avatar,
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Fab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
} from "@mui/material"
import {
    ChevronLeft,
    ChevronRight,
    ExpandMore,
    Description,
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import Estimation from "../../components/Estimation"
import Loading from "../../components/Loading"
import { useParams, useLocation } from "react-router-dom"

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: "12px 0",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&:before": { display: "none" },
    "&.Mui-expanded": { margin: "12px 0" },
}))

const StyledTableHeader = styled(TableRow)(({ theme }) => ({
    "& th": {
        backgroundColor: "#f8fafc",
        color: "#4f46e5",
        fontWeight: 600,
        fontSize: "0.875rem",
        borderBottom: `2px solid #e2e8f0`,
    },
}))

const AgentCard = styled(Card)(({ theme }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "scale(1.02)",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    },
}))

const AdminFab = styled(Fab)(({ theme }) => ({
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#4f46e5",
    color: "white",
    "&:hover": {
        backgroundColor: "#4338ca",
    },
}))

// Helper function to get image URL
const getImageUrl = (image) => {
    if (!image) return ""
    if (typeof image === "object" && image.url) return image.url
    if (typeof image === "string") {
        return image.startsWith("blob:") ? image : `http://localhost:3001/uploads/${image}`
    }
    return ""
}

export default function InstitutionPage({ institution: initialInstitution, onClose }) {
    const { id } = useParams()
    const location = useLocation()
    const [institution, setInstitution] = useState(initialInstitution || null)
    const [tabIndex, setTabIndex] = useState(0)
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
    const [agentScrollIndex, setAgentScrollIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [documentCategories, setDocumentCategories] = useState([])
    const [allAgents, setAllAgents] = useState([])
    const agentsRef = useRef(null)
    const bannerIntervalRef = useRef(null)

    // Admin edit state
    const [isAdmin, setIsAdmin] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [editedInstitution, setEditedInstitution] = useState(
        initialInstitution
            ? JSON.parse(JSON.stringify(initialInstitution))
            : {
                institutionName: "",
                profilePicture: "",
                bannerImages: [],
                overview: { details: "" },
                locations: [],
                programs: [],
                scholarships: [],
                entryRequirements: {
                    undergraduate: {},
                    postgraduate: {},
                },
                documents: {},
            },
    )
    const [pendingDeletions, setPendingDeletions] = useState({
        locations: [],
        programs: [],
        scholarships: [],
        bannerImages: [],
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogType, setDialogType] = useState("")
    const [dialogData, setDialogData] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [editingProgram, setEditingProgram] = useState(null)
    const [editingScholarship, setEditingScholarship] = useState(null)
    const [editingLocation, setEditingLocation] = useState(null)

    useEffect(() => {
        if (initialInstitution) {
            setInstitution(initialInstitution)
            setEditedInstitution(JSON.parse(JSON.stringify(initialInstitution)))
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }, [initialInstitution])

    useEffect(() => {
        axios
            .get("http://localhost:3001/api/documents")
            .then((response) => {
                const formattedData = response.data.map((category) => ({
                    title: category.document,
                    details: category.docs.map((doc, index) => ({
                        name: doc,
                        source: category.src[index],
                        additional: category.info[index],
                    })),
                }))
                setDocumentCategories(formattedData)
            })
            .catch((error) => {
                console.error("Error fetching documents:", error)
            })
    }, [])

    const matchedAgents = institution?.agents
        ?.map((agentName) => {
            const agentData = allAgents.find((agent) => agent[agentName])
            if (!agentData) return null
            return {
                name: agentName,
                ...agentData[agentName],
            }
        })
        .filter((agent) => agent !== null)

    const startBannerInterval = () => {
        bannerIntervalRef.current = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % (editedInstitution?.bannerImages?.length || 1))
        }, 5000)
    }

    useEffect(() => {
        startBannerInterval()
        return () => clearInterval(bannerIntervalRef.current)
    }, [editedInstitution?.bannerImages])

    const handleBannerNavigation = (direction) => {
        clearInterval(bannerIntervalRef.current)
        if (direction === "left") {
            setCurrentBannerIndex(
                (prev) =>
                    (prev - 1 + (editedInstitution?.bannerImages?.length || 1)) % (editedInstitution?.bannerImages?.length || 1),
            )
        } else {
            setCurrentBannerIndex((prev) => (prev + 1) % (editedInstitution?.bannerImages?.length || 1))
        }
        startBannerInterval()
    }

    const handleAgentScroll = (direction) => {
        let visibleCards = 3
        if (window.innerWidth < 600) visibleCards = 1
        else if (window.innerWidth < 960) visibleCards = 2

        setAgentScrollIndex((prev) => {
            const newIndex = prev + (direction === "left" ? -1 : 1)
            return Math.max(0, Math.min(newIndex, (matchedAgents?.length || 0) - visibleCards))
        })
    }

    const extractMonths = (intakes) => {
        if (!intakes) return []
        return intakes
            .split(",")
            .map((intake) => intake.trim().split(" ")[0])
            .filter((month, index, self) => self.indexOf(month) === index)
    }

    const filteredPrograms = institution?.programs?.filter((program) =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleEditMode = () => {
        if (editMode) {
            // Cancel all changes
            setEditedInstitution(JSON.parse(JSON.stringify(institution)))
            setPendingDeletions({
                locations: [],
                programs: [],
                scholarships: [],
                bannerImages: [],
            })
        }
        setEditMode(!editMode)
    }

    const handleSaveChanges = async (e) => {
        // If it's a form submission event, prevent default behavior
        if (e && e.preventDefault) {
            e.preventDefault()
        }

        try {
            // First, filter out marked items
            const toSave = {
                ...editedInstitution,
                locations: editedInstitution.locations?.filter(
                    (loc) => !pendingDeletions.locations.includes(loc._id) && !loc.markedForDeletion,
                ),
                programs: editedInstitution.programs?.filter(
                    (prog) => !pendingDeletions.programs.includes(prog._id) && !prog.markedForDeletion,
                ),
                scholarships: editedInstitution.scholarships?.filter(
                    (scholar) => !pendingDeletions.scholarships.includes(scholar._id) && !scholar.markedForDeletion,
                ),
                bannerImages: editedInstitution.bannerImages?.filter((_, idx) => !pendingDeletions.bannerImages.includes(idx)),
            }

            const response = await axios.put(`http://localhost:3001/api/institutions/${institution._id}`, {
                ...toSave,
                deletions: pendingDeletions,
            })

            setInstitution(response.data.institution)
            setEditedInstitution(JSON.parse(JSON.stringify(response.data.institution)))
            setPendingDeletions({
                locations: [],
                programs: [],
                scholarships: [],
                bannerImages: [],
            })
            setEditMode(false)

            setSnackbar({
                open: true,
                message: "Changes saved successfully!",
                severity: "success",
            })

            // Don't automatically close/redirect
            // if (onClose) {
            //   setTimeout(() => {
            //     onClose();
            //   }, 2000);
            // }
        } catch (error) {
            console.error("Error saving changes:", error)
            setSnackbar({
                open: true,
                message: "Error saving changes. Please try again.",
                severity: "error",
            })
        }
    }

    const deleteItem = (field, itemId) => {
        if (field === "bannerImages") {
            // For banner images, we use the index as itemId
            setPendingDeletions((prev) => ({
                ...prev,
                bannerImages: [...prev.bannerImages, itemId],
            }))

            // Mark for deletion visually
            setEditedInstitution((prev) => ({
                ...prev,
                bannerImages: prev.bannerImages.map((img, idx) => (idx === itemId ? { ...img, markedForDeletion: true } : img)),
            }))

            setSnackbar({
                open: true,
                message: "Banner image marked for deletion. Save to confirm.",
                severity: "info",
            })
            return
        }

        // For other items
        setPendingDeletions((prev) => ({
            ...prev,
            [field]: [...prev[field], itemId],
        }))

        // Mark for deletion visually
        setEditedInstitution((prev) => ({
            ...prev,
            [field]: prev[field].map((item) => (item._id === itemId ? { ...item, markedForDeletion: true } : item)),
        }))

        setSnackbar({
            open: true,
            message: `${field.slice(0, -1)} marked for deletion. Save to confirm.`,
            severity: "info",
        })
    }

    const handleInputChange = (field, value) => {
        setEditedInstitution((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleNestedInputChange = (parent, field, value) => {
        setEditedInstitution((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }))
    }

    const handleEntryRequirementsChange = (level, field, value) => {
        setEditedInstitution((prev) => ({
            ...prev,
            entryRequirements: {
                ...prev.entryRequirements,
                [level]: {
                    ...prev.entryRequirements?.[level],
                    [field]: value,
                },
            },
        }))
    }

    // Program editing
    const openProgramDialog = (program = null) => {
        setEditingProgram(
            program
                ? { ...program }
                : {
                    name: "",
                    level: "",
                    duration: "",
                    intakes: "",
                    firstYearFees: "",
                    campuses: "",
                    ielts: "",
                    url: "",
                },
        )
        setDialogType("program")
        setOpenDialog(true)
    }

    const handleProgramChange = (field, value) => {
        setEditingProgram((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const saveProgramChanges = () => {
        const updatedPrograms = [...(editedInstitution.programs || [])]

        if (editingProgram._id) {
            const index = updatedPrograms.findIndex((p) => p._id === editingProgram._id)
            if (index !== -1) {
                updatedPrograms[index] = editingProgram
            }
        } else {
            updatedPrograms.push({
                ...editingProgram,
                _id: Date.now().toString(),
            })
        }

        setEditedInstitution((prev) => ({
            ...prev,
            programs: updatedPrograms,
        }))
        setOpenDialog(false)
    }

    // Scholarship editing
    const openScholarshipDialog = (scholarship = null) => {
        setEditingScholarship(
            scholarship
                ? { ...scholarship }
                : {
                    name: "",
                    link: "",
                },
        )
        setDialogType("scholarship")
        setOpenDialog(true)
    }

    const handleScholarshipChange = (field, value) => {
        setEditingScholarship((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Fix the saveScholarshipChanges function to handle _id properly
    const saveScholarshipChanges = () => {
        const updatedScholarships = [...(editedInstitution.scholarships || [])]

        if (editingScholarship._id) {
            const index = updatedScholarships.findIndex((s) => s._id === editingScholarship._id)
            if (index !== -1) {
                updatedScholarships[index] = editingScholarship
            }
        } else {
            // Don't generate an _id here, let MongoDB handle it
            updatedScholarships.push({
                ...editingScholarship,
                // Use a temporary ID for UI purposes only
                _id: `temp_${Date.now()}`,
            })
        }

        setEditedInstitution((prev) => ({
            ...prev,
            scholarships: updatedScholarships,
        }))

        setSnackbar({
            open: true,
            message: `Scholarship "${editingScholarship.name}" ${editingScholarship._id ? "updated" : "added"}. Save changes to confirm.`,
            severity: "success",
        })

        setOpenDialog(false)
    }

    // Location editing
    const openLocationDialog = (location = null) => {
        setEditingLocation(
            location
                ? { ...location }
                : {
                    campusName: "",
                    city: "",
                    country: "",
                },
        )
        setDialogType("location")
        setOpenDialog(true)
    }

    const handleLocationChange = (field, value) => {
        setEditingLocation((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const saveLocationChanges = () => {
        const updatedLocations = [...(editedInstitution.locations || [])]

        if (editingLocation._id) {
            const index = updatedLocations.findIndex((l) => l._id === editingLocation._id)
            if (index !== -1) {
                updatedLocations[index] = editingLocation
            }
        } else {
            updatedLocations.push({
                ...editingLocation,
                _id: Date.now().toString(),
            })
        }

        setEditedInstitution((prev) => ({
            ...prev,
            locations: updatedLocations,
        }))
        setOpenDialog(false)
    }

    // Image handling
    const handleProfilePictureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append("image", file)

            axios
                .post("http://localhost:3001/api/upload", formData)
                .then((response) => {
                    setEditedInstitution((prev) => ({
                        ...prev,
                        profilePicture: response.data.filename,
                    }))
                    setSnackbar({
                        open: true,
                        message: "Profile picture uploaded successfully!",
                        severity: "success",
                    })
                })
                .catch((error) => {
                    console.error("Error uploading profile picture:", error)
                    setSnackbar({
                        open: true,
                        message: "Error uploading profile picture. Please try again.",
                        severity: "error",
                    })
                })
        }
    }

    const handleBannerImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const currentBanners = editedInstitution.bannerImages || []
            if (currentBanners.length >= 5) {
                setSnackbar({
                    open: true,
                    message: "Maximum 5 banner images allowed",
                    severity: "error",
                })
                return
            }

            const file = e.target.files[0]
            const formData = new FormData()
            formData.append("image", file)

            // Optimistically update UI
            const tempUrl = URL.createObjectURL(file)
            setEditedInstitution((prev) => ({
                ...prev,
                bannerImages: [...(prev.bannerImages || []), tempUrl],
            }))

            axios
                .post("http://localhost:3001/api/upload", formData)
                .then((response) => {
                    // Replace temp URL with actual filename
                    setEditedInstitution((prev) => ({
                        ...prev,
                        bannerImages: [...prev.bannerImages.slice(0, -1), response.data.filename],
                    }))
                    setSnackbar({
                        open: true,
                        message: "Banner image uploaded successfully!",
                        severity: "success",
                    })
                })
                .catch((error) => {
                    // Remove the temp image on error
                    setEditedInstitution((prev) => ({
                        ...prev,
                        bannerImages: prev.bannerImages.slice(0, -1),
                    }))
                    console.error("Error uploading banner image:", error)
                    setSnackbar({
                        open: true,
                        message: "Error uploading banner image. Please try again.",
                        severity: "error",
                    })
                })
        }
    }

    if (!institution || !editedInstitution) {
        return <Loading />
    }

    const tabContent = [
        // Overview Tab
        <Paper
            key="overview"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                About {institution.institutionName}
            </Typography>
            {editMode ? (
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={editedInstitution.overview?.details || ""}
                    onChange={(e) => handleNestedInputChange("overview", "details", e.target.value)}
                    sx={{ mb: 2 }}
                />
            ) : (
                <Typography variant="body1" color="text.secondary" textAlign="left" sx={{ lineHeight: 1.6 }}>
                    {institution.overview?.details}
                </Typography>
            )}
        </Paper>,

        // Locations Tab
        <Paper
            key="locations"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                    Campuses
                </Typography>
                {editMode && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => openLocationDialog()}
                        sx={{ backgroundColor: "#4f46e5" }}
                    >
                        Add Campus
                    </Button>
                )}
            </Box>
            <Grid container spacing={3}>
                {(editMode ? editedInstitution.locations : institution.locations)?.map((location, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: "transform 0.3s, boxShadow 0.3s",
                                "&:hover": { transform: "scale(1)", boxShadow: 6 },
                                position: "relative",
                                opacity: location.markedForDeletion ? 0.6 : 1,
                                border: location.markedForDeletion ? "2px dashed red" : "none",
                            }}
                        >
                            {location.markedForDeletion && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(255,0,0,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography variant="body2" color="error">
                                        Marked for deletion
                                    </Typography>
                                </Box>
                            )}
                            <CardContent sx={{ p: 2 }}>
                                {editMode && !location.markedForDeletion && (
                                    <Box sx={{ position: "absolute", top: 5, right: 5, display: "flex", gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => openLocationDialog(location)}
                                            sx={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteItem("locations", location._id)}
                                            sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                )}
                                <Typography variant="body1" sx={{ fontWeight: "medium", textAlign: "center" }}>
                                    {location.campusName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                                    {location.city}, {location.country}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>,

        // Programs Tab
        <Paper
            key="programs"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                    Programs Offered
                </Typography>
                {editMode && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => openProgramDialog()}
                        sx={{ backgroundColor: "#4f46e5" }}
                    >
                        Add Program
                    </Button>
                )}
            </Box>
            <TextField
                fullWidth
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
            />
            <Grid container spacing={3}>
                {(editMode
                    ? editedInstitution.programs?.filter((program) =>
                        program.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    : filteredPrograms
                )?.map((program, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: "transform 0.2s, boxShadow 0.2s",
                                "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                                position: "relative",
                                opacity: program.markedForDeletion ? 0.6 : 1,
                                border: program.markedForDeletion ? "2px dashed red" : "none",
                            }}
                        >
                            {program.markedForDeletion && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(255,0,0,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography variant="body2" color="error">
                                        Marked for deletion
                                    </Typography>
                                </Box>
                            )}
                            {editMode && !program.markedForDeletion && (
                                <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => openProgramDialog(program)}
                                        sx={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => deleteItem("programs", program._id)}
                                        sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>
                            )}
                            <CardContent
                                sx={{
                                    overflow: "auto",
                                    flexGrow: 1,
                                    paddingTop: editMode ? "40px" : "16px",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: "bold",
                                        marginRight: editMode ? "40px" : "0",
                                    }}
                                >
                                    {program.name}
                                </Typography>
                                <List>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`Level: ${program.level}`}
                                            primaryTypographyProps={{ fontWeight: "medium" }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`Duration: ${program.duration}`}
                                            primaryTypographyProps={{ fontWeight: "medium" }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`Intakes: ${program.intakes}`}
                                            primaryTypographyProps={{ fontWeight: "medium" }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`Fees: ${program.firstYearFees}`}
                                            primaryTypographyProps={{ fontWeight: "medium" }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText primary={`Campus: ${program.campuses}`} />
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={`IELTS Requirement: ${program.ielts || "Not specified"}`}
                                            primaryTypographyProps={{ fontWeight: "medium" }}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button
                                    variant="contained"
                                    href={program.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#4f46e5",
                                        borderRadius: 2,
                                        py: 1,
                                        fontWeight: "bold",
                                        "&:hover": { backgroundColor: "#4338ca", transform: "scale(1.02)" },
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>,

        // Intakes Tab
        <Paper
            key="intakes"
            elevation={3}
            sx={{
                p: 3,
                backgroundColor: "background.paper",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                }}
            >
                Intakes
            </Typography>
            <Grid container spacing={3}>
                {Array.from(new Set(institution.programs?.flatMap((program) => extractMonths(program.intakes)))).map(
                    (month, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    transition: "transform 0.2s, boxShadow 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 2, textAlign: "center" }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: "medium",
                                            textAlign: "center",
                                        }}
                                    >
                                        {month}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ),
                )}
            </Grid>
        </Paper>,

        // Scholarships Tab
        <Paper
            key="scholarships"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                    Scholarships
                </Typography>
                {editMode && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => openScholarshipDialog()}
                        sx={{ backgroundColor: "#4f46e5" }}
                    >
                        Add Scholarship
                    </Button>
                )}
            </Box>
            <Grid container spacing={3}>
                {(editMode ? editedInstitution.scholarships : institution.scholarships)?.map((scholarship, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                minHeight: 100,
                                minWidth: 200,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: "transform 0.2s, boxShadow 0.2s",
                                "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                                position: "relative",
                                opacity: scholarship.markedForDeletion ? 0.6 : 1,
                                border: scholarship.markedForDeletion ? "2px dashed red" : "none",
                            }}
                        >
                            {scholarship.markedForDeletion && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(255,0,0,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography variant="body2" color="error">
                                        Marked for deletion
                                    </Typography>
                                </Box>
                            )}
                            {editMode && !scholarship.markedForDeletion && (
                                <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 1, zIndex: 2 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => openScholarshipDialog(scholarship)}
                                        sx={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => deleteItem("scholarships", scholarship._id)}
                                        sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>
                            )}
                            <CardContent sx={{ p: 2, flexGrow: 1, pt: editMode ? 4 : 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: "medium",
                                        textAlign: "center",
                                        paddingTop: editMode ? 1 : 0,
                                        paddingRight: editMode ? 2 : 0,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {scholarship.name}
                                </Typography>
                                <Box sx={{ textAlign: "center", mt: 2 }}>
                                    <a
                                        href={scholarship.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "bold" }}
                                    >
                                        Learn More
                                    </a>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>,

        // Entry Requirements Tab
        <Paper
            key="entryRequirements"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
                Entry Requirements
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        Undergraduate
                    </Typography>
                    {editMode ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="GPA"
                                    value={editedInstitution.entryRequirements?.undergraduate?.GPA || ""}
                                    onChange={(e) => handleEntryRequirementsChange("undergraduate", "GPA", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="IELTS"
                                    value={editedInstitution.entryRequirements?.undergraduate?.IELTS || ""}
                                    onChange={(e) => handleEntryRequirementsChange("undergraduate", "IELTS", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="PTE"
                                    value={editedInstitution.entryRequirements?.undergraduate?.PTE || ""}
                                    onChange={(e) => handleEntryRequirementsChange("undergraduate", "PTE", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="TOEFL"
                                    value={editedInstitution.entryRequirements?.undergraduate?.TOEFL || ""}
                                    onChange={(e) => handleEntryRequirementsChange("undergraduate", "TOEFL", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <List>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`GPA: ${institution.entryRequirements?.undergraduate?.GPA}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`IELTS: ${institution.entryRequirements?.undergraduate?.IELTS}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`PTE: ${institution.entryRequirements?.undergraduate?.PTE}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`TOEFL: ${institution.entryRequirements?.undergraduate?.TOEFL}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                        </List>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                        Postgraduate
                    </Typography>
                    {editMode ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="GPA"
                                    value={editedInstitution.entryRequirements?.postgraduate?.GPA || ""}
                                    onChange={(e) => handleEntryRequirementsChange("postgraduate", "GPA", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="IELTS"
                                    value={editedInstitution.entryRequirements?.postgraduate?.IELTS || ""}
                                    onChange={(e) => handleEntryRequirementsChange("postgraduate", "IELTS", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="PTE"
                                    value={editedInstitution.entryRequirements?.postgraduate?.PTE || ""}
                                    onChange={(e) => handleEntryRequirementsChange("postgraduate", "PTE", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="TOEFL"
                                    value={editedInstitution.entryRequirements?.postgraduate?.TOEFL || ""}
                                    onChange={(e) => handleEntryRequirementsChange("postgraduate", "TOEFL", e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <List>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`GPA: ${institution.entryRequirements?.postgraduate?.GPA}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`IELTS: ${institution.entryRequirements?.postgraduate?.IELTS}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`PTE: ${institution.entryRequirements?.postgraduate?.PTE}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText
                                    primary={`TOEFL: ${institution.entryRequirements?.postgraduate?.TOEFL}`}
                                    primaryTypographyProps={{ fontWeight: "medium" }}
                                />
                            </ListItem>
                        </List>
                    )}
                </Grid>
            </Grid>
        </Paper>,

        // Estimate Cost Tab
        <Paper
            key="estimateCost"
            elevation={3}
            sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
            <Estimation />
        </Paper>,

        // Documents Tab
        <div key="documents" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 24px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <Typography
                    variant="h4"
                    sx={{ mb: 3, color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}
                >
                    <Description sx={{ color: "#4f46e5", fontSize: "2rem" }} />
                    Required Documents
                </Typography>

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    {documentCategories.map((category, index) => (
                        <React.Fragment key={index}>
                            <StyledAccordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore sx={{ color: "#4f46e5" }} />}
                                    sx={{ "&:hover": { backgroundColor: "#f8fafc" }, padding: "0 16px" }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 2 }}
                                    >
                                        <span
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                backgroundColor: "#e0e7ff",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#4f46e5",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                        {category.title}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails sx={{ padding: 0 }}>
                                    <TableContainer
                                        sx={{ borderTop: "1px solid #e2e8f0", borderRadius: "0 0 12px 12px", overflow: "hidden" }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <StyledTableHeader>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        S.N.
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: "30%" }}>
                                                        Document
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: "30%" }}>
                                                        Source
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: "30%" }}>
                                                        Details
                                                    </TableCell>
                                                </StyledTableHeader>
                                            </TableHead>
                                            <TableBody>
                                                {category.details.map((doc, idx) => (
                                                    <TableRow
                                                        key={idx}
                                                        sx={{ "&:last-child td": { borderBottom: 0 }, "&:hover": { backgroundColor: "#f8fafc" } }}
                                                    >
                                                        <TableCell align="center" sx={{ color: "#64748b" }}>
                                                            {idx + 1}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                                                        <TableCell sx={{ color: "#4f46e5" }}>{doc.source}</TableCell>
                                                        <TableCell sx={{ color: "#64748b" }}>{doc.additional}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </StyledAccordion>

                            {index < documentCategories.length - 1 && <Divider sx={{ my: 1, borderColor: "#e2e8f0" }} />}
                        </React.Fragment>
                    ))}

                    {institution?.documents && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, color: "#4f46e5", fontWeight: 600 }}>
                                Additional Documents
                            </Typography>
                            <Grid container spacing={3}>
                                {Object.entries(editMode ? editedInstitution.documents || {} : institution.documents || {}).map(
                                    ([key, value], idx) => (
                                        <Grid item xs={12} sm={6} md={4} key={idx}>
                                            <Card
                                                sx={{
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    borderRadius: 2,
                                                    boxShadow: 3,
                                                    transition: "transform 0.2s, boxShadow 0.2s",
                                                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#1e293b", mb: 1 }}>
                                                        {key.replace(/_/g, " ")}
                                                    </Typography>
                                                    {editMode ? (
                                                        Array.isArray(value) ? (
                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={3}
                                                                value={value.join("\n")}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value.split("\n").filter((line) => line.trim() !== "")
                                                                    const updatedDocs = { ...editedInstitution.documents, [key]: newValue }
                                                                    setEditedInstitution((prev) => ({ ...prev, documents: updatedDocs }))
                                                                }}
                                                            />
                                                        ) : (
                                                            <TextField
                                                                fullWidth
                                                                value={value.toString()}
                                                                onChange={(e) => {
                                                                    const updatedDocs = { ...editedInstitution.documents, [key]: e.target.value }
                                                                    setEditedInstitution((prev) => ({ ...prev, documents: updatedDocs }))
                                                                }}
                                                            />
                                                        )
                                                    ) : Array.isArray(value) ? (
                                                        <List dense>
                                                            {value.map((item, itemIndex) => (
                                                                <ListItem key={itemIndex} sx={{ py: 0.5, px: 1 }}>
                                                                    <ListItemText
                                                                        primary={item}
                                                                        primaryTypographyProps={{ fontWeight: "medium", color: "text.primary" }}
                                                                    />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    ) : (
                                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                            {value.toString()}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Box>
                    )}
                </div>
            </div>
        </div>,
    ]

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
            <Container sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            View and manage institution details
                        </Typography>
                    </Box>
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={onClose}>
                        BACK TO INSTITUTIONS
                    </Button>
                </Box>

                {/* Institution Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 4, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={`http://localhost:3001/uploads/${editMode ? editedInstitution.profilePicture : institution.profilePicture}`}
                            alt="Institution Logo"
                            sx={{
                                width: 100,
                                height: 100,
                                border: "2px solid #4f46e5",
                                boxShadow: 3,
                                "& img": { objectFit: "contain" },
                            }}
                        />
                        {editMode && (
                            <IconButton
                                component="label"
                                sx={{
                                    position: "absolute",
                                    bottom: -5,
                                    right: -5,
                                    backgroundColor: "rgba(79, 70, 229, 0.9)",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#4338ca" },
                                }}
                            >
                                <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                    {editMode ? (
                        <TextField
                            fullWidth
                            value={editedInstitution.institutionName}
                            onChange={(e) => handleInputChange("institutionName", e.target.value)}
                            sx={{ fontWeight: "bold", minWidth: { xs: "100%", sm: "400px" } }}
                        />
                    ) : (
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "#333", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
                        >
                            {institution.institutionName}
                        </Typography>
                    )}
                </Box>

                {/* Banner Slideshow */}
                <Box sx={{ position: "relative", height: 400, mb: 4, borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            width: `${(editedInstitution?.bannerImages?.length || 1) * 100}%`,
                            height: "100%",
                            transform: `translateX(-${currentBannerIndex * (100 / (editedInstitution?.bannerImages?.length || 1))}%)`,
                            transition: "transform 0.5s ease-in-out",
                        }}
                    >
                        {editedInstitution?.bannerImages?.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: `${100 / (editedInstitution?.bannerImages?.length || 1)}%`,
                                    height: "100%",
                                    position: "relative",
                                    flexShrink: 0,
                                    opacity: pendingDeletions.bannerImages.includes(index) ? 0.6 : 1,
                                    border: pendingDeletions.bannerImages.includes(index) ? "2px dashed red" : "none",
                                }}
                            >
                                {pendingDeletions.bannerImages.includes(index) && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(255,0,0,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: 1,
                                        }}
                                    >
                                        <Typography variant="body2" color="error">
                                            Marked for deletion
                                        </Typography>
                                    </Box>
                                )}
                                <img
                                    src={getImageUrl(image) || "/placeholder.svg"}
                                    alt={`Banner ${index + 1}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                {editMode && !pendingDeletions.bannerImages.includes(index) && (
                                    <IconButton
                                        onClick={() => deleteItem("bannerImages", index)}
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            backgroundColor: "rgba(239, 68, 68, 0.8)",
                                            color: "white",
                                            "&:hover": { backgroundColor: "rgba(239, 68, 68, 1)" },
                                            zIndex: 2,
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>

                    {editedInstitution?.bannerImages?.length > 1 && (
                        <>
                            <IconButton
                                onClick={() => handleBannerNavigation("left")}
                                sx={{
                                    position: "absolute",
                                    left: 16,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>
                            <IconButton
                                onClick={() => handleBannerNavigation("right")}
                                sx={{
                                    position: "absolute",
                                    right: 16,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </>
                    )}

                    {editMode && (
                        <IconButton
                            component="label"
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                                backgroundColor: "rgba(79, 70, 229, 0.9)",
                                color: "white",
                                "&:hover": { backgroundColor: "#4338ca" },
                            }}
                            disabled={editedInstitution?.bannerImages?.length >= 5}
                        >
                            <input type="file" hidden accept="image/*" onChange={handleBannerImageUpload} />
                            <AddIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Tabs Section */}
                <Tabs
                    value={tabIndex}
                    onChange={(e, newIndex) => setTabIndex(newIndex)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        mb: 3,
                        "& .MuiTab-root": { fontWeight: "bold" },
                        "& .Mui-selected": { color: "#4f46e5 !important" },
                    }}
                >
                    {[
                        "Overview",
                        "Locations",
                        "Programs",
                        "Intakes",
                        "Scholarship",
                        "Entry Requirements",
                        "Estimate Cost",
                        "Documents",
                    ].map((label, index) => (
                        <Tab key={index} label={label} />
                    ))}
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ mb: 4 }}>{tabContent[tabIndex]}</Box>
            </Container>

            {/* Admin Edit FAB */}
            {isAdmin && (
                <AdminFab color="primary" aria-label="edit" onClick={toggleEditMode}>
                    {editMode ? <CancelIcon /> : <EditIcon />}
                </AdminFab>
            )}

            {/* Save Changes FAB */}
            {isAdmin && editMode && (
                <Fab
                    color="success"
                    aria-label="save"
                    onClick={handleSaveChanges}
                    sx={{
                        position: "fixed",
                        bottom: 20,
                        right: 90,
                        backgroundColor: "#10b981",
                        color: "white",
                        "&:hover": { backgroundColor: "#059669" },
                    }}
                >
                    <SaveIcon />
                </Fab>
            )}

            {/* Edit Dialogs */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === "program" && (editingProgram?._id ? "Edit Program" : "Add Program")}
                    {dialogType === "scholarship" && (editingScholarship?._id ? "Edit Scholarship" : "Add Scholarship")}
                    {dialogType === "location" && (editingLocation?._id ? "Edit Campus" : "Add Campus")}
                </DialogTitle>
                <DialogContent>
                    {dialogType === "program" && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Program Name"
                                    value={editingProgram?.name || ""}
                                    onChange={(e) => handleProgramChange("name", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Level"
                                    value={editingProgram?.level || ""}
                                    onChange={(e) => handleProgramChange("level", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Duration"
                                    value={editingProgram?.duration || ""}
                                    onChange={(e) => handleProgramChange("duration", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Intakes"
                                    value={editingProgram?.intakes || ""}
                                    onChange={(e) => handleProgramChange("intakes", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Year Fees"
                                    value={editingProgram?.firstYearFees || ""}
                                    onChange={(e) => handleProgramChange("firstYearFees", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="IELTS Requirement"
                                    value={editingProgram?.ielts || ""}
                                    onChange={(e) => handleProgramChange("ielts", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Campuses"
                                    value={editingProgram?.campuses || ""}
                                    onChange={(e) => handleProgramChange("campuses", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="URL"
                                    value={editingProgram?.url || ""}
                                    onChange={(e) => handleProgramChange("url", e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {dialogType === "scholarship" && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Scholarship Name"
                                    value={editingScholarship?.name || ""}
                                    onChange={(e) => handleScholarshipChange("name", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Link"
                                    value={editingScholarship?.link || ""}
                                    onChange={(e) => handleScholarshipChange("link", e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {dialogType === "location" && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Campus Name"
                                    value={editingLocation?.campusName || ""}
                                    onChange={(e) => handleLocationChange("campusName", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={editingLocation?.city || ""}
                                    onChange={(e) => handleLocationChange("city", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={editingLocation?.country || ""}
                                    onChange={(e) => handleLocationChange("country", e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (dialogType === "program") saveProgramChanges()
                            else if (dialogType === "scholarship") saveScholarshipChanges()
                            else if (dialogType === "location") saveLocationChanges()
                        }}
                        variant="contained"
                        sx={{ backgroundColor: "#4f46e5" }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{
                    top: { xs: 80, sm: 100 }, // Increased top position to make it more visible
                    "& .MuiAlert-root": {
                        width: "100%",
                        maxWidth: "600px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        fontSize: "1rem",
                    },
                    zIndex: 100, // Ensure it's above everything else
                }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
