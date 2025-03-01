import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    Button,
    Stack,
    Avatar,
    Grid,
} from "@mui/material";
import {
    School as SchoolIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon,
    ArrowForward as ArrowIcon,
    AttachMoney as MoneyIcon,
} from "@mui/icons-material";

const ProgramCard = ({ program }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                width: "450px", // Increased width to fit more content
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header with Avatar and Program Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        sx={{ width: 56, height: 56, bgcolor: "#4f46e5" }}
                        alt={program.institution}
                    >
                        {program.institution[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {program.program}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {program.institution}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Level, Campus, and Duration in a Row */}
                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                    {/* Campus */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                        <Box>
                            <Typography variant="body2">
                                {program.campus}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Level */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                        <Box>
                            <Typography variant="body2">
                                {program.level}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Duration */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TimeIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                        <Box>
                            <Typography variant="body2">
                                {program.duration}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Program Details in Two Columns */}
                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            {/* Intakes */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Intakes:
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {program.intakes.map((intake, index) => (
                                        <Chip
                                            key={index}
                                            label={intake}
                                            size="small"
                                            sx={{
                                                borderRadius: 1,
                                                backgroundColor: "#e0e7ff",
                                                color: "#4f46e5",
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Language Requirements */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Language Requirements:
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip
                                        label={`IELTS: ${program.ielts}`}
                                        size="small"
                                        sx={{
                                            borderRadius: 1,
                                            backgroundColor: "#e0e7ff",
                                            color: "#4f46e5",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* GPA */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    GPA Requirement:
                                </Typography>
                                <Typography variant="body2">
                                    {program.gpa}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            {/* Tuition Fees */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Tuition Fees:
                                </Typography>
                                <Typography variant="body2">
                                    ${program.fees.toLocaleString()} per year
                                </Typography>
                            </Box>

                            {/* Application Fees */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Application Fees:
                                </Typography>
                                <Typography variant="body2">
                                    ${program.applicationFees?.toLocaleString() || "N/A"}
                                </Typography>
                            </Box>

                            {/* Funds Required */}
                            <Box>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Funds Required:
                                </Typography>
                                <Typography variant="body2">
                                    ${program.requiredFunds?.toLocaleString() || "N/A"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Divider and Button */}
                <Divider sx={{ my: 2 }} />
                <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowIcon />}
                    sx={{
                        backgroundColor: "#4f46e5",
                        "&:hover": {
                            backgroundColor: "#4338ca",
                        },
                    }}
                >
                    Learn More
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProgramCard;