import { useState, useEffect } from "react"
import { 
    Box, Card, CardContent, Typography, LinearProgress, Grid, Tabs, Tab
} from "@mui/material"
import OfferStage from "./stages/OfferStage"
import GSStage from "./stages/GSStage"
import COEStage from "./stages/COEStage"
import VisaStage from "./stages/VisaStage"

function StageCard({ title, progress, active, onClick }) {
    return (
        <Card
            elevation={active ? 3 : 1}
            sx={{
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: active ? "#4f46e5" : "background.paper",
                color: active ? "white" : "text.primary",
                border: active ? "1px solid #4f46e5" : "1px solid rgba(0, 0, 0, 0.12)",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                    borderColor: "#4f46e5",
                },
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {title}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: active ? "rgba(255, 255, 255, 0.3)" : "rgba(79, 70, 229, 0.1)",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: active ? "white" : "#4f46e5",
                        }
                    }}
                />
                <Typography 
                    variant="body2" 
                    sx={{ 
                        mt: 1.5, 
                        textAlign: "right",
                        color: active ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                        fontWeight: 500
                    }}
                >
                    {progress}% complete
                </Typography>
            </CardContent>
        </Card>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    )
}

export default function ProgressTracker() {
    const [activeTab, setActiveTab] = useState(0);
    const [stageProgress, setStageProgress] = useState({
        offer: { completed: 0, total: 0, percentage: 0 },
        gs: { completed: 0, total: 0, percentage: 0 },
        coe: { completed: 0, total: 0, percentage: 0 },
        visa: { completed: 0, total: 0, percentage: 0 },
    });
    const [overallProgress, setOverallProgress] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);

    useEffect(() => {
        calculateOverallProgress();
    }, [stageProgress, activeTab]);

    const calculateOverallProgress = () => {
        const activeStage = Object.keys(stageProgress)[activeTab];
        const { completed, total } = stageProgress[activeStage];
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        setTotalCompleted(completed);
        setTotalTasks(total);
        setOverallProgress(percentage);
    };

    const updateStageProgress = (stage, progress) => {
        setStageProgress((prev) => ({
            ...prev,
            [stage]: progress,
        }));
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
            <Card sx={{ 
                mt: 4,
                mb: 4,
                border: 'none',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: 3
            }}>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                        Overall Application Progress
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mr: 2, color: "#4f46e5" }}>
                            {overallProgress}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {totalCompleted} of {totalTasks} tasks completed
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={overallProgress} 
                        sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            bgcolor: "rgba(79, 70, 229, 0.1)",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                bgcolor: "#4f46e5",
                            }
                        }} 
                    />
                </CardContent>
            </Card>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StageCard
                        title="Offer Stage"
                        progress={stageProgress.offer.percentage}
                        active={activeTab === 0}
                        onClick={() => setActiveTab(0)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StageCard
                        title="GS Stage"
                        progress={stageProgress.gs.percentage}
                        active={activeTab === 1}
                        onClick={() => setActiveTab(1)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StageCard
                        title="COE Stage"
                        progress={stageProgress.coe.percentage}
                        active={activeTab === 2}
                        onClick={() => setActiveTab(2)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StageCard
                        title="Visa Stage"
                        progress={stageProgress.visa.percentage}
                        active={activeTab === 3}
                        onClick={() => setActiveTab(3)}
                    />
                </Grid>
            </Grid>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="inherit"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTab-root": {
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "0.9375rem",
                            minHeight: 48,
                            color: "text.primary",
                            "&.Mui-selected": {
                                color: "#4f46e5",
                            },
                        }
                    }}
                >
                    <Tab label="Offer Stage" />
                    <Tab label="GS Stage" />
                    <Tab label="COE Stage" />
                    <Tab label="Visa Stage" />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                <OfferStage updateProgress={(progress) => updateStageProgress("offer", progress)} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <GSStage updateProgress={(progress) => updateStageProgress("gs", progress)} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
                <COEStage updateProgress={(progress) => updateStageProgress("coe", progress)} />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
                <VisaStage updateProgress={(progress) => updateStageProgress("visa", progress)} />
            </TabPanel>
        </Box>
    );
}