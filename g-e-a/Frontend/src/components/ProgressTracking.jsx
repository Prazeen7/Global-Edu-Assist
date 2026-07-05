import { useState, useEffect, useContext } from "react"
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    LinearProgress,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Snackbar,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
    CheckCircle as CheckCircleIcon,
    FormatListBulleted as ListIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material"
import OfferStage from "./stages/OfferStage"
import GSStage from "./stages/GSStage"
import COEStage from "./stages/COEStage"
import VisaStage from "./stages/VisaStage"
import AllDocumentsChecklist from "./AllDocumentsChecklist"
import { AuthContext } from "../Context/context"
import { jwtDecode } from "jwt-decode"
import axiosInstance from "../utils/axiosConfig"

// Styled components
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(91, 95, 239, 0.2)",
    "& .MuiLinearProgress-bar": {
        borderRadius: 5,
        backgroundColor: "#5B5FEF",
    },
}))

const ProgressCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
}))

const StageCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
    padding: theme.spacing(2),
    boxShadow: active ? "0 4px 10px rgba(91, 95, 239, 0.3)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    border: active ? "1px solid #5B5FEF" : "1px solid rgba(0, 0, 0, 0.12)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        boxShadow: "0 4px 10px rgba(91, 95, 239, 0.2)",
        transform: "translateY(-2px)",
    },
}))

const CompletionButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(1.5, 3),
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
        backgroundColor: "#388E3C",
    },
}))

// Simple confetti component
const Confetti = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            {Array.from({ length: 100 }).map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        backgroundColor:
                            i % 5 === 0
                                ? "#5B5FEF"
                                : i % 5 === 1
                                    ? "#4CAF50"
                                    : i % 5 === 2
                                        ? "#FFC107"
                                        : i % 5 === 3
                                            ? "#F44336"
                                            : "#2196F3",
                        borderRadius: "50%",
                        top: "-10px",
                        left: `${Math.random() * 100}%`,
                        opacity: 1,
                        animation: "confettiDrop 3s ease-out forwards",
                        animationDelay: `${Math.random() * 3}s`,
                    }}
                />
            ))}
        </Box>
    )
}

export default function ProgressTracker() {
    // Get user information from auth context and JWT token
    const { LoggedIn } = useContext(AuthContext)
    const [userId, setUserId] = useState("")
    const [userName, setUserName] = useState("")

    // Get user ID and name from JWT token
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUserId(decoded.userId)
                setUserName(decoded.name || "User")
            } catch (error) {
                console.error("Error decoding token:", error)
            }
        }
    }, [LoggedIn])

    // Add global styles for confetti animation
    useEffect(() => {
        const styleElement = document.createElement("style")
        styleElement.innerHTML = `
      @keyframes confettiDrop {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `
        document.head.appendChild(styleElement)

        return () => {
            document.head.removeChild(styleElement)
        }
    }, [])

    const [activeTab, setActiveTab] = useState("offer")
    const [stageProgress, setStageProgress] = useState({
        offer: { completed: 0, total: 0, percentage: 0, items: [] },
        gs: { completed: 0, total: 0, percentage: 0, items: [] },
        coe: { completed: 0, total: 0, percentage: 0, items: [] },
        visa: { completed: 0, total: 0, percentage: 0, items: [] },
    })
    const [overallProgress, setOverallProgress] = useState(0)
    const [totalCompleted, setTotalCompleted] = useState(0)
    const [totalTasks, setTotalTasks] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [initialized, setInitialized] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [completedAt, setCompletedAt] = useState(null)

    // New states for completion dialog and feedback
    const [openCompletionDialog, setOpenCompletionDialog] = useState(false)
    const [openResetDialog, setOpenResetDialog] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    // New state for all documents view
    const [showAllDocuments, setShowAllDocuments] = useState(false)

    useEffect(() => {
        // Only fetch progress data when we have a userId
        if (userId) {
            fetchProgressData()
        }
    }, [userId])

    const fetchProgressData = async () => {
        if (!userId) return

        try {
            setLoading(true)
            setError(null)

            const response = await axiosInstance.get(`/progress/${userId}`)

            if (response.data.success) {
                const { stages, currentStage, overallProgress, isCompleted, completedAt } = response.data.data

                // Update state with fetched data
                setActiveTab(currentStage)
                setStageProgress({
                    offer: stages.offer,
                    gs: stages.gs,
                    coe: stages.coe,
                    visa: stages.visa,
                })
                setOverallProgress(overallProgress)
                setTotalCompleted(stages.offer.completed + stages.gs.completed + stages.coe.completed + stages.visa.completed)
                setTotalTasks(stages.offer.total + stages.gs.total + stages.coe.total + stages.visa.total)
                setIsCompleted(isCompleted || false)
                setCompletedAt(completedAt)
                setInitialized(true)
            } else {
                setError("Failed to load progress data")
            }
        } catch (error) {
            console.error("Failed to fetch progress data:", error)
            if (error.response && error.response.status === 404) {
                setInitialized(false)
            } else {
                setError("Failed to load progress data. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const initializeProgressData = async () => {
        if (!userId || !userName) return

        try {
            setLoading(true)
            setError(null)

            const response = await axiosInstance.post("/progress/initialize", {
                userId,
                userName,
            })

            if (response.data.success) {
                // Fetch the newly initialized data
                fetchProgressData()
            } else {
                setError("Failed to initialize progress data")
            }
        } catch (error) {
            console.error("Failed to initialize progress data:", error)
            setError("Failed to initialize progress data. Please try again.")
            setLoading(false)
        }
    }

    const updateStageProgress = async (stage, progress, items) => {
        if (!userId) return

        try {
            // Update local state first for immediate feedback
            setStageProgress((prev) => ({
                ...prev,
                [stage]: {
                    ...progress,
                    items: items || prev[stage].items,
                },
            }))

            // Calculate new overall progress
            calculateOverallProgress()

            // Update on server
            await axiosInstance.put(`/progress/${userId}/update`, {
                stage,
                items: items || stageProgress[stage].items,
                currentStage: activeTab,
            })
        } catch (error) {
            console.error("Failed to update progress:", error)
            setError("Failed to save progress. Please try again.")

            // Revert to server state on error
            fetchProgressData()
        }
    }

    const calculateOverallProgress = () => {
        const allStages = Object.values(stageProgress)
        let completed = 0
        let total = 0

        allStages.forEach((stage) => {
            completed += stage.completed
            total += stage.total
        })

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        setTotalCompleted(completed)
        setTotalTasks(total)
        setOverallProgress(percentage)
    }

    const handleTabChange = (event, newValue) => {
        if (newValue === "all") {
            setShowAllDocuments(true)
            return
        }

        setShowAllDocuments(false)
        setActiveTab(newValue)

        // Update current stage on server
        try {
            axiosInstance.put(`/progress/${userId}/update`, {
                stage: activeTab, // Send current stage data
                items: stageProgress[activeTab].items,
                currentStage: newValue, // Update to new stage
            })
        } catch (error) {
            console.error("Failed to update current stage:", error)
        }
    }

    const handleOpenResetDialog = () => {
        setOpenResetDialog(true)
    }

    const handleCloseResetDialog = () => {
        setOpenResetDialog(false)
    }

    const resetProgress = async () => {
        if (!userId) return

        try {
            setLoading(true)
            const response = await axiosInstance.post(`/progress/${userId}/reset`)

            if (response.data.success) {
                // Refresh data from server
                fetchProgressData()
                setOpenResetDialog(false)
                setSuccessMessage("Progress has been reset successfully")
                setShowSuccessMessage(true)
            }
        } catch (error) {
            console.error("Failed to reset progress:", error)
            setError("Failed to reset progress. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // New function to handle completion
    const handleOpenCompletionDialog = () => {
        setOpenCompletionDialog(true)
    }

    const handleCloseCompletionDialog = () => {
        setOpenCompletionDialog(false)
    }

    const handleCompleteTracking = async () => {
        if (!userId) return

        try {
            setLoading(true)

            const response = await axiosInstance.post(`/progress/${userId}/complete`)

            if (response.data.success) {
                setIsCompleted(true)
                setCompletedAt(response.data.data.completedAt)
                setOpenCompletionDialog(false)

                // Show success feedback
                setSuccessMessage("Congratulations! Your application process is now complete!")
                setShowSuccessMessage(true)
                setShowConfetti(true)

                // Hide confetti after 5 seconds
                setTimeout(() => {
                    setShowConfetti(false)
                }, 5000)
            }
        } catch (error) {
            console.error("Failed to complete tracking:", error)
            setError("Failed to complete tracking. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCloseSuccessMessage = () => {
        setShowSuccessMessage(false)
    }

    // Toggle all documents view
    const toggleAllDocumentsView = () => {
        setShowAllDocuments(!showAllDocuments)
    }

    // Check if visa stage is complete
    const isVisaStageComplete = stageProgress.visa.percentage === 100

    // If user is not logged in or no userId is available
    if (!userId) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        Authentication Required
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Please log in to access your progress tracking.
                    </Typography>
                </Card>
            </Container>
        )
    }

    if (!initialized && !loading && !error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        Progress Tracking Not Initialized
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        You need to initialize progress tracking to start tracking your application progress.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={initializeProgressData}
                        sx={{ bgcolor: "#5B5FEF", "&:hover": { bgcolor: "#4B4FDF" } }}
                    >
                        Initialize Progress Tracking
                    </Button>
                </Card>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
            {showConfetti && <Confetti />}

            <Snackbar
                open={showSuccessMessage}
                autoHideDuration={6000}
                onClose={handleCloseSuccessMessage}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSuccessMessage} severity="success" variant="filled" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <Typography>Loading progress data...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : (
                <>
                    {isCompleted && (
                        <Alert
                            severity="success"
                            sx={{ mb: 3, display: "flex", alignItems: "center" }}
                            icon={<CheckCircleIcon fontSize="large" />}
                        >
                            <Box>
                                <Typography variant="h6">Application Process Completed!</Typography>
                                <Typography variant="body2">
                                    You completed your application process on {new Date(completedAt).toLocaleDateString()} at{" "}
                                    {new Date(completedAt).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        </Alert>
                    )}

                    <Card sx={{ mb: 4, boxShadow: 3, border: "none" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            Overall Progress
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" gutterBottom>
                                            {totalCompleted} of {totalTasks} tasks completed
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <StyledLinearProgress variant="determinate" value={overallProgress} />
                                            <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 0.5 }}>
                                                {overallProgress}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <StageCard active={activeTab === "offer"} onClick={() => handleTabChange(null, "offer")}>
                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    Offer
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color={activeTab === "offer" ? "#5B5FEF" : "inherit"}
                                                >
                                                    {stageProgress.offer.percentage}%
                                                </Typography>
                                            </StageCard>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <StageCard active={activeTab === "gs"} onClick={() => handleTabChange(null, "gs")}>
                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    GS
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" color={activeTab === "gs" ? "#5B5FEF" : "inherit"}>
                                                    {stageProgress.gs.percentage}%
                                                </Typography>
                                            </StageCard>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <StageCard active={activeTab === "coe"} onClick={() => handleTabChange(null, "coe")}>
                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    COE
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" color={activeTab === "coe" ? "#5B5FEF" : "inherit"}>
                                                    {stageProgress.coe.percentage}%
                                                </Typography>
                                            </StageCard>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <StageCard active={activeTab === "visa"} onClick={() => handleTabChange(null, "visa")}>
                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    Visa
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" color={activeTab === "visa" ? "#5B5FEF" : "inherit"}>
                                                    {stageProgress.visa.percentage}%
                                                </Typography>
                                            </StageCard>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Tabs
                            value={showAllDocuments ? "all" : activeTab}
                            onChange={handleTabChange}
                            sx={{
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "#5B5FEF",
                                },
                                "& .MuiTab-root": {
                                    textTransform: "none",
                                    minWidth: 0,
                                    "&.Mui-selected": {
                                        color: "#5B5FEF",
                                    },
                                },
                            }}
                        >
                            <Tab label="Offer Stage" value="offer" />
                            <Tab label="GS Stage" value="gs" />
                            <Tab label="COE Stage" value="coe" />
                            <Tab label="Visa Stage" value="visa" />
                            <Tab label="All Documents" value="all" icon={<ListIcon />} iconPosition="start" />
                        </Tabs>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RefreshIcon />}
                            onClick={handleOpenResetDialog}
                            sx={{ ml: 2 }}
                        >
                            Reset Progress
                        </Button>
                    </Box>

                    {showAllDocuments ? (
                        <AllDocumentsChecklist stageProgress={stageProgress} updateStageProgress={updateStageProgress} />
                    ) : (
                        <>
                            <Box hidden={activeTab !== "offer"}>
                                {activeTab === "offer" && (
                                    <OfferStage
                                        items={stageProgress.offer.items}
                                        updateProgress={(progress) => updateStageProgress("offer", progress, progress.items)}
                                    />
                                )}
                            </Box>
                            <Box hidden={activeTab !== "gs"}>
                                {activeTab === "gs" && (
                                    <GSStage
                                        items={stageProgress.gs.items}
                                        updateProgress={(progress) => updateStageProgress("gs", progress, progress.items)}
                                    />
                                )}
                            </Box>
                            <Box hidden={activeTab !== "coe"}>
                                {activeTab === "coe" && (
                                    <COEStage
                                        items={stageProgress.coe.items}
                                        updateProgress={(progress) => updateStageProgress("coe", progress, progress.items)}
                                    />
                                )}
                            </Box>
                            <Box hidden={activeTab !== "visa"}>
                                {activeTab === "visa" && (
                                    <VisaStage
                                        items={stageProgress.visa.items}
                                        updateProgress={(progress) => updateStageProgress("visa", progress, progress.items)}
                                    />
                                )}
                            </Box>
                        </>
                    )}

                    {/* Completion Button - Only show on Visa stage when it's 100% complete and not already marked as completed */}
                    {activeTab === "visa" && isVisaStageComplete && !isCompleted && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CompletionButton
                                variant="contained"
                                size="large"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleOpenCompletionDialog}
                                disabled={loading}
                            >
                                Complete Application Process
                            </CompletionButton>
                        </Box>
                    )}

                    {/* Completion Confirmation Dialog */}
                    <Dialog
                        open={openCompletionDialog}
                        onClose={handleCloseCompletionDialog}
                        aria-labelledby="completion-dialog-title"
                        aria-describedby="completion-dialog-description"
                    >
                        <DialogTitle id="completion-dialog-title">{"Complete Your Application Process?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="completion-dialog-description">
                                Congratulations on reaching this milestone! By marking your application process as complete, you're
                                confirming that you've successfully completed all the required steps for your application. This action
                                cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCompletionDialog} color="primary">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCompleteTracking}
                                color="primary"
                                variant="contained"
                                autoFocus
                                sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
                            >
                                Complete Process
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Reset Progress Dialog */}
                    <Dialog
                        open={openResetDialog}
                        onClose={handleCloseResetDialog}
                        aria-labelledby="reset-dialog-title"
                        aria-describedby="reset-dialog-description"
                    >
                        <DialogTitle id="reset-dialog-title">{"Reset Progress?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="reset-dialog-description">
                                Are you sure you want to reset your progress? This will clear all checked items across all stages. This
                                action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseResetDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={resetProgress} color="error" variant="contained" autoFocus>
                                Reset Progress
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    )
}
